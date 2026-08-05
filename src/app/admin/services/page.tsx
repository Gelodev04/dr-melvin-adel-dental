import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPhp } from "@/lib/utils";
import { ServiceEditor } from "@/components/admin/ServiceEditor";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.clinicId) redirect("/admin/login");

  const services = await prisma.service.findMany({
    where: { clinicId: session.user.clinicId },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Services</h1>
      <p className="mt-1 text-sm text-brand-800/65">
        Update names, duration, and guide prices (PHP).
      </p>
      <ul className="mt-6 space-y-3">
        {services.map((s) => (
          <li
            key={s.id}
            className="rounded-2xl border border-brand-200 bg-white p-4"
          >
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-display text-lg font-medium">{s.name}</p>
                <p className="text-xs text-brand-800/50">
                  {s.durationMin} min · {formatPhp(s.pricePhp)} ·{" "}
                  {s.active ? "Active" : "Hidden"}
                </p>
              </div>
            </div>
            <ServiceEditor service={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}
