import { addMinutes, parseISO, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { prisma } from "./prisma";

export type Slot = {
  startAt: string;
  endAt: string;
  label: string;
};

function minutesToLabel(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Generate bookable slots for a doctor on a calendar date (clinic timezone).
 */
export async function getAvailableSlots(params: {
  clinicId: string;
  doctorId: string;
  serviceId: string;
  dateIso: string; // YYYY-MM-DD
  timezone?: string;
}): Promise<Slot[]> {
  const timezone = params.timezone || "Asia/Manila";
  const service = await prisma.service.findFirst({
    where: { id: params.serviceId, clinicId: params.clinicId, active: true },
  });
  if (!service) return [];

  const doctorOk = await prisma.doctorService.findUnique({
    where: {
      doctorId_serviceId: {
        doctorId: params.doctorId,
        serviceId: params.serviceId,
      },
    },
  });
  if (!doctorOk) return [];

  const localNoon = parseISO(`${params.dateIso}T12:00:00`);
  const dayOfWeek = localNoon.getDay();

  const hours = await prisma.weeklyHour.findUnique({
    where: {
      clinicId_dayOfWeek: { clinicId: params.clinicId, dayOfWeek },
    },
  });
  if (!hours || hours.closed) return [];

  const dayStartLocal = startOfDay(localNoon);
  const exception = await prisma.availabilityException.findFirst({
    where: {
      clinicId: params.clinicId,
      closed: true,
      date: {
        gte: dayStartLocal,
        lt: addMinutes(dayStartLocal, 24 * 60),
      },
    },
  });
  if (exception) return [];

  const duration = service.durationMin;
  const step = Math.min(30, duration);

  const rangeStart = fromZonedTime(`${params.dateIso}T00:00:00`, timezone);
  const rangeEnd = fromZonedTime(`${params.dateIso}T23:59:59`, timezone);

  const existing = await prisma.appointment.findMany({
    where: {
      doctorId: params.doctorId,
      status: { in: ["PENDING", "CONFIRMED"] },
      startAt: { gte: rangeStart, lte: rangeEnd },
    },
  });

  const slots: Slot[] = [];
  const now = new Date();

  for (
    let startMin = hours.startMin;
    startMin + duration <= hours.endMin;
    startMin += step
  ) {
    const hh = String(Math.floor(startMin / 60)).padStart(2, "0");
    const mm = String(startMin % 60).padStart(2, "0");
    const startAt = fromZonedTime(
      `${params.dateIso}T${hh}:${mm}:00`,
      timezone
    );
    const endAt = addMinutes(startAt, duration);

    if (startAt <= now) continue;

    const overlaps = existing.some(
      (a) => startAt < a.endAt && endAt > a.startAt
    );
    if (overlaps) continue;

    slots.push({
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      label: minutesToLabel(startMin),
    });
  }

  return slots;
}

export async function hasConflict(params: {
  doctorId: string;
  startAt: Date;
  endAt: Date;
  excludeId?: string;
}): Promise<boolean> {
  const clash = await prisma.appointment.findFirst({
    where: {
      doctorId: params.doctorId,
      status: { in: ["PENDING", "CONFIRMED"] },
      id: params.excludeId ? { not: params.excludeId } : undefined,
      startAt: { lt: params.endAt },
      endAt: { gt: params.startAt },
    },
  });
  return Boolean(clash);
}
