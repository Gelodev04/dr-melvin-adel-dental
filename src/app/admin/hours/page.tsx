import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HoursEditor } from "@/components/admin/HoursEditor";

export const dynamic = "force-dynamic";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function AdminHoursPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.clinicId) redirect("/admin/login");

  const hours = await prisma.weeklyHour.findMany({
    where: { clinicId: session.user.clinicId },
    orderBy: { dayOfWeek: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Weekly hours</h1>
      <p className="mt-1 text-sm text-brand-800/65">
        Booking slots follow these hours (Asia/Manila).
      </p>
      <div className="mt-6 rounded-2xl border border-brand-200 bg-white p-4">
        <HoursEditor
          hours={hours.map((h) => ({
            id: h.id,
            dayOfWeek: h.dayOfWeek,
            dayName: DAY_NAMES[h.dayOfWeek],
            startMin: h.startMin,
            endMin: h.endMin,
            closed: h.closed,
          }))}
        />
      </div>
    </div>
  );
}
