import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { formatInTimeZone } from "date-fns-tz";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { statusLabel } from "@/lib/utils";
import { AppointmentActions } from "@/components/admin/AppointmentActions";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.clinicId) redirect("/admin/login");

  const { status } = await searchParams;
  const clinicId = session.user.clinicId;

  const appointments = await prisma.appointment.findMany({
    where: {
      clinicId,
      ...(status ? { status: status.toUpperCase() } : {}),
    },
    include: { service: true, doctor: true },
    orderBy: { startAt: "asc" },
    take: 100,
  });

  const filters = [
    { label: "All", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Appointments</h1>
      <p className="mt-1 text-sm text-brand-800/65">
        Confirm, cancel, or mark visits complete.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (status || "").toUpperCase() === f.value;
          const href = f.value ? `/admin?status=${f.value}` : "/admin";
          return (
            <a
              key={f.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                active
                  ? "bg-brand-600 text-white"
                  : "bg-white text-brand-700 ring-1 ring-brand-200"
              }`}
            >
              {f.label}
            </a>
          );
        })}
      </div>

      <ul className="mt-6 space-y-3">
        {appointments.map((a) => (
          <li
            key={a.id}
            className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-display text-lg font-medium">
                  {a.patientName}
                </p>
                <p className="text-sm text-brand-800/70">
                  {a.service.name} · {a.doctor.name}
                </p>
                <p className="mt-1 text-sm font-medium text-brand-700">
                  {formatInTimeZone(
                    a.startAt,
                    "Asia/Manila",
                    "EEE, MMM d · h:mm a"
                  )}
                </p>
                <p className="mt-1 text-xs text-brand-800/55">
                  {a.patientPhone} · {a.patientEmail}
                </p>
                {a.notes && (
                  <p className="mt-2 text-sm text-brand-800/65">Note: {a.notes}</p>
                )}
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-800">
                  {statusLabel(a.status)}
                </span>
                <AppointmentActions id={a.id} status={a.status} />
              </div>
            </div>
          </li>
        ))}
        {appointments.length === 0 && (
          <li className="rounded-2xl border border-dashed border-brand-300 bg-white/60 p-8 text-center text-sm text-brand-800/60">
            No appointments in this filter yet.
          </li>
        )}
      </ul>
    </div>
  );
}
