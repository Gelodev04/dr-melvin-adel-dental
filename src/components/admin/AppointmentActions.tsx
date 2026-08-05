"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AppointmentActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    await fetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "PENDING" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => setStatus("CONFIRMED")}
          className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Confirm
        </button>
      )}
      {(status === "PENDING" || status === "CONFIRMED") && (
        <button
          type="button"
          disabled={busy}
          onClick={() => setStatus("CANCELLED")}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200 disabled:opacity-50"
        >
          Cancel
        </button>
      )}
      {status === "CONFIRMED" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => setStatus("COMPLETED")}
          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-200 disabled:opacity-50"
        >
          Complete
        </button>
      )}
    </div>
  );
}
