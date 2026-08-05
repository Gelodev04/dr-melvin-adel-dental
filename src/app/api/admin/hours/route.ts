import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  hours: z.array(
    z.object({
      id: z.string(),
      startMin: z.number().int().min(0).max(24 * 60),
      endMin: z.number().int().min(0).max(24 * 60),
      closed: z.boolean(),
    })
  ),
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.clinicId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  for (const row of parsed.data.hours) {
    const existing = await prisma.weeklyHour.findFirst({
      where: { id: row.id, clinicId: session.user.clinicId },
    });
    if (!existing) continue;
    if (!row.closed && row.endMin <= row.startMin) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }
    await prisma.weeklyHour.update({
      where: { id: row.id },
      data: {
        startMin: row.startMin,
        endMin: row.endMin,
        closed: row.closed,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
