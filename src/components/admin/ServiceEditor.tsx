"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  pricePhp: number | null;
  active: boolean;
};

export function ServiceEditor({ service }: { service: Service }) {
  const router = useRouter();
  const [name, setName] = useState(service.name);
  const [description, setDescription] = useState(service.description ?? "");
  const [durationMin, setDurationMin] = useState(String(service.durationMin));
  const [pricePhp, setPricePhp] = useState(
    service.pricePhp != null ? String(service.pricePhp) : ""
  );
  const [active, setActive] = useState(service.active);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        durationMin: Number(durationMin),
        pricePhp: pricePhp === "" ? null : Number(pricePhp),
        active,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setMessage("Saved");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-xl border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500 sm:col-span-2"
        placeholder="Name"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="rounded-xl border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500 sm:col-span-2"
        placeholder="Description"
      />
      <input
        type="number"
        min={10}
        step={5}
        value={durationMin}
        onChange={(e) => setDurationMin(e.target.value)}
        className="rounded-xl border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        placeholder="Duration (min)"
      />
      <input
        type="number"
        min={0}
        value={pricePhp}
        onChange={(e) => setPricePhp(e.target.value)}
        className="rounded-xl border border-brand-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        placeholder="Price PHP"
      />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active (visible for booking)
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {message && <span className="text-xs text-brand-700">{message}</span>}
      </div>
    </form>
  );
}
