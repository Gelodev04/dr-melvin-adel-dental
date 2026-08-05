import { NextResponse } from "next/server";
import { addMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hasConflict } from "@/lib/slots";
import { sendBookingEmails } from "@/lib/email";
import { clinicConfig } from "@/lib/clinic-config";

const bodySchema = z.object({
  serviceId: z.string().min(1),
  doctorId: z.string().min(1),
  startAt: z.string().min(1),
  patientName: z.string().min(2).max(120),
  patientEmail: z.string().email(),
  patientPhone: z.string().min(10).max(30),
  notes: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking details", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const clinic = await prisma.clinic.findFirst();
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const service = await prisma.service.findFirst({
      where: { id: data.serviceId, clinicId: clinic.id, active: true },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const link = await prisma.doctorService.findUnique({
      where: {
        doctorId_serviceId: {
          doctorId: data.doctorId,
          serviceId: data.serviceId,
        },
      },
      include: { doctor: true },
    });
    if (!link || !link.doctor.active) {
      return NextResponse.json(
        { error: "Dentist does not offer this service" },
        { status: 400 }
      );
    }

    const startAt = new Date(data.startAt);
    if (Number.isNaN(startAt.getTime()) || startAt <= new Date()) {
      return NextResponse.json(
        { error: "Please choose a future time slot" },
        { status: 400 }
      );
    }

    const endAt = addMinutes(startAt, service.durationMin);

    if (
      await hasConflict({
        doctorId: data.doctorId,
        startAt,
        endAt,
      })
    ) {
      return NextResponse.json(
        { error: "That time was just taken. Pick another slot." },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        clinicId: clinic.id,
        serviceId: service.id,
        doctorId: data.doctorId,
        startAt,
        endAt,
        status: "PENDING",
        patientName: data.patientName.trim(),
        patientEmail: data.patientEmail.trim().toLowerCase(),
        patientPhone: data.patientPhone.trim(),
        notes: data.notes?.trim(),
      },
      include: { service: true, doctor: true },
    });

    const whenLabel = formatInTimeZone(
      startAt,
      clinic.timezone || clinicConfig.timezone,
      "EEEE, MMM d, yyyy 'at' h:mm a"
    );

    await sendBookingEmails({
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      serviceName: appointment.service.name,
      doctorName: appointment.doctor.name,
      whenLabel,
      clinicEmail: clinic.email,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not create appointment" },
      { status: 500 }
    );
  }
}
