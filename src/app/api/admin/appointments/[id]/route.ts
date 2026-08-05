import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APPOINTMENT_STATUSES } from "@/lib/utils";

const schema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.clinicId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.appointment.findFirst({
    where: { id, clinicId: session.user.clinicId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: body.data.status },
  });

  return NextResponse.json({ appointment });
}
