import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (!serviceId || !doctorId || !date) {
    return NextResponse.json(
      { error: "serviceId, doctorId, and date are required" },
      { status: 400 }
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const clinic = await prisma.clinic.findFirst();
  if (!clinic) {
    return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
  }

  const slots = await getAvailableSlots({
    clinicId: clinic.id,
    doctorId,
    serviceId,
    dateIso: date,
    timezone: clinic.timezone,
  });

  return NextResponse.json({ slots });
}
