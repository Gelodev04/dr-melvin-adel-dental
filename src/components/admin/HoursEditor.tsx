"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type HourRow = {
  id: string;
  dayOfWeek: number;
  dayName: string;
  startMin: number;
  endMin: number;
  closed: boolean;
};

function toTimeInput(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function fromTimeInput(value: string) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

export function HoursEditor({ hours: initial }: { hours: HourRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function update(id: string, patch: Partial<HourRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hours: rows.map((r) => ({
          id: r.id,
          startMin: r.startMin,
          endMin: r.endMin,
          closed: r.closed,
        })),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setMessage("Hours saved");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div
          key={r.id}
          className="grid grid-cols-2 items-center gap-3 border-b border-brand-100 pb-3 sm:grid-cols-4"
        >
          <p className="font-medium text-sm">{r.dayName}</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={r.closed}
              onChange={(e) => update(r.id, { closed: e.target.checked })}
            />
            Closed
          </label>
          <input
            type="time"
            disabled={r.closed}
            value={toTimeInput(r.startMin)}
            onChange={(e) =>
              update(r.id, { startMin: fromTimeInput(e.target.value) })
            }
            className="rounded-xl border border-brand-200 px-2 py-1.5 text-sm disabled:opacity-40"
          />
          <input
            type="time"
            disabled={r.closed}
            value={toTimeInput(r.endMin)}
            onChange={(e) =>
              update(r.id, { endMin: fromTimeInput(e.target.value) })
            }
            className="rounded-xl border border-brand-200 px-2 py-1.5 text-sm disabled:opacity-40"
          />
        </div>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save hours"}
        </button>
        {message && <span className="text-sm text-brand-700">{message}</span>}
      </div>
    </div>
  );
}
