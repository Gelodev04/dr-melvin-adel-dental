import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("serviceId");

  const clinic = await prisma.clinic.findFirst();
  if (!clinic) {
    return NextResponse.json(
      { error: "Clinic not set up. Run yarn db:setup." },
      { status: 404 }
    );
  }

  if (serviceId) {
    const links = await prisma.doctorService.findMany({
      where: { serviceId },
      include: { doctor: true },
    });
    const doctors = links
      .map((l) => l.doctor)
      .filter((d) => d.active && d.clinicId === clinic.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return NextResponse.json({ doctors });
  }

  const services = await prisma.service.findMany({
    where: { clinicId: clinic.id, active: true },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({ services, clinicId: clinic.id });
}
