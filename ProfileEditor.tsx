"use client";
import { useState } from "react";
import { z } from "zod";
import { QRCodeCanvas } from "qrcode.react";
import { authFetch } from "../../../lib/auth-fetch";
import { supabase } from "../../../lib/supabase-browser";

const schema = z.object({
  published: z.boolean().default(false),
  name: z.string().min(2, "Gym name is required"),
  address: z.string().min(4, "Address is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  description: z.string().max(800, "Max 800 chars").optional(),
  amenities: z.object({
    freeWeights: z.boolean(),
    cardio: z.boolean(),
    classes: z.boolean(),
    training: z.boolean(),
    lockers: z.boolean(),
    sauna: z.boolean(),
  }),
  colors: z.object({
    primary: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Hex color"),
    secondary: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Hex color"),
  }),
  photos: z.array(z.string()).default([]),
});

export type GymForm = z.infer<typeof schema>;

export default function ProfileEditor({ initial }: { initial?: Partial<GymForm> }) {
  const [form, setForm] = useState<GymForm>({
    published: initial?.published ?? false,
    name: initial?.name || "",
    address: initial?.address || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    description: initial?.description || "",
    amenities: initial?.amenities || { freeWeights: false, cardio: false, classes: false, training: false, lockers: false, sauna: false },
    colors: initial?.colors || { primary: "#38e07b", secondary: "#f6f8f7" },
    photos: initial?.photos || [],
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<null | { ok: true; slug: string } | { ok: false }>(null);
  const [uploading, setUploading] = useState(false);

  function setField<K extends keyof GymForm>(k: K, v: GymForm[K]) {
    setForm(s => ({ ...s, [k]: v }));
  }

  function setAmenity(k: keyof GymForm["amenities"], v: boolean) {
    setForm(s => ({ ...s, amenities: { ...s.amenities, [k]: v } }));
  }

  async function onSave() {
    setSaving(true); setSaved(null); setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const map: Record<string,string> = {};
      parsed.error.issues.forEach(i => {
        const path = i.path.join(".");
        if (!map[path]) map[path] = i.message;
      });
      setErrors(map);
      setSaving(false);
      return;
    }
    try {
      const res = await authFetch("/api/partner/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSaved({ ok: true, slug: data.slug });
    } catch (e) {
      console.error(e);
      setSaved({ ok: false } as any);
    } finally {
      setSaving(false);
      setTimeout(()=>setSaved(null), 3000);
    }
  }

  async function pickAndUpload() {
    try {
      setUploading(true);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;
      input.onchange = async () => {
        const files = Array.from(input.files || []);
        const uploaded: string[] = [];
        for (const f of files) {
          const ext = f.name.split(".").pop() || "jpg";
          const path = `gym-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { data, error } = await supabase.storage.from("duoaxs-media").upload(path, f, { contentType: f.type });
          if (error) throw error;
          const { data: pub } = supabase.storage.from("duoaxs-media").getPublicUrl(path);
          uploaded.push(pub.publicUrl);
        }
        setForm(s => ({ ...s, photos: [...s.photos, ...uploaded] }));
        setUploading(false);
      };
      input.click();
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-black dark:text-white">Business Details</h2>
        <div className="space-y-4">
          <Field label="Gym Name" error={errors["name"]} value={form.name} onChange={v=>setField("name", v)} placeholder="e.g., DuoAxs Fitness Hub" />
          <Field label="Address" error={errors["address"]} value={form.address} onChange={v=>setField("address", v)} placeholder="123 Wellness St, Anytown" />
          <Field label="Phone Number" value={form.phone || ""} onChange={v=>setField("phone", v)} placeholder="(123) 456-7890" type="tel" />
          <Field label="Email" error={errors["email"]} value={form.email || ""} onChange={v=>setField("email", v)} placeholder="contact@duoaxs.com" type="email" />
          <Textarea label="Description" error={errors["description"]} value={form.description || ""} onChange={v=>setField("description", v)} placeholder="Tell us about your gym..." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-black dark:text-white">Amenities</h2>
        <div className="grid grid-cols-2 gap-4">
          <Amenity label="Free Weights" checked={form.amenities.freeWeights} onChange={v=>setAmenity("freeWeights", v)} />
          <Amenity label="Cardio" checked={form.amenities.cardio} onChange={v=>setAmenity("cardio", v)} />
          <Amenity label="Group Classes" checked={form.amenities.classes} onChange={v=>setAmenity("classes", v)} />
          <Amenity label="Training" checked={form.amenities.training} onChange={v=>setAmenity("training", v)} />
          <Amenity label="Locker Rooms" checked={form.amenities.lockers} onChange={v=>setAmenity("lockers", v)} />
          <Amenity label="Sauna" checked={form.amenities.sauna} onChange={v=>setAmenity("sauna", v)} />
        </div>
      </section>

      <section className="space-y-4" onDragOver={(e)=>{e.preventDefault();}} onDrop={async (e)=>{e.preventDefault(); const files = Array.from(e.dataTransfer.files||[]).filter(f=>f.type.startsWith("image/")); if(!files.length) return; const input = { files } as any; /* reuse picker */ }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">Photos</h2>
          <button disabled={uploading} onClick={pickAndUpload} className="flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full bg-primary text-background-dark">
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
        {form.photos?.length ? (
          <div className="grid grid-cols-3 gap-2">
            {form.photos.map((p, idx) => (
              <div
                key={p + idx}
                className="relative rounded-lg overflow-hidden group"
                draggable
                onDragStart={(e)=>{ e.dataTransfer.setData("text/plain", String(idx)); }}
                onDragOver={(e)=>{ e.preventDefault(); }}
                onDrop={(e)=>{
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData("text/plain"));
                  const to = idx;
                  if (Number.isNaN(from) || from===to) return;
                  setForm(s => {
                    const arr = [...s.photos];
                    const [moved] = arr.splice(from,1);
                    arr.splice(to,0,moved);
                    return { ...s, photos: arr };
                  });
                }}
              >
                <img className="object-cover w-full h-full aspect-square" src={p} />
                <button
                  onClick={()=>setForm(s => ({...s, photos: s.photos.filter((x,i)=>i!==idx)}))}
                  className="absolute top-2 right-2 hidden group-hover:block rounded bg-black/60 px-2 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </div>
            ))}
            <button onClick={pickAndUpload} className="flex items-center justify-center border-2 border-dashed rounded-lg border-primary/50 bg-primary/10 dark:bg-primary/20 aspect-square">
              +
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-primary/40 p-6 text-sm text-neutral-500">Drag & drop or click Upload to add photos.</div>
        )}
      </section>


      <section className="space-y-4">
        <h2 className="text-xl font-bold text-black dark:text-white">Visibility</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e)=>setField("published", e.target.checked as any)}
            className="form-checkbox h-5 w-5 rounded text-primary bg-transparent border-primary/50 focus:ring-primary"
          />
          <span className={"text-sm font-medium " + (form.published ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400")}>
            {form.published ? "Published — visible in search" : "Unlisted — only accessible via link"}
          </span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-black dark:text-white">Branding</h2>
        <div className="grid grid-cols-2 gap-4">
          <ColorInput label="Primary Color" value={form.colors.primary} onChange={v=>setField("colors", { ...form.colors, primary: v })} error={errors["colors.primary"]} />
          <ColorInput label="Secondary Color" value={form.colors.secondary} onChange={v=>setField("colors", { ...form.colors, secondary: v })} error={errors["colors.secondary"]} />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className={"h-12 px-5 text-base font-bold rounded-xl text-background-dark " + (saving ? "bg-primary/70" : "bg-primary hover:bg-primary/90")}
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
        {saved?.ok && (
          <a href={`/gym/${saved.slug}`} className="h-12 px-5 text-base font-bold rounded-xl border border-primary/60 text-primary hover:bg-primary/10">
            Preview
          </a>
        )}
      </div>


      {saved?.ok && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-black dark:text-white">Gym Check‑in QR</h4>
          <div className="inline-block rounded-lg bg-white p-3">
            <QRCodeCanvas value={typeof window !== "undefined" ? (window.location.origin + "/checkin?gym=" + saved.slug) : ("/checkin?gym=" + saved.slug)} size={140} includeMargin />
          </div>
          <p className="text-xs text-neutral-500">Members scan this at the front desk to start a session.</p>
        </div>
      )}
    
      {Object.keys(errors).length > 0 && (
        <div className="text-sm text-red-600 dark:text-red-400">
          {Object.entries(errors).map(([k,v]) => (<div key={k}>{k}: {v}</div>))}
        </div>
      )}
      {saved && !saved.ok && <p className="text-red-600 dark:text-red-400 text-sm">Save failed. Check console.</p>}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", error }: any) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black/70 dark:text-white/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        className={"form-input mt-1 block w-full rounded-lg border-primary/20 bg-primary/10 dark:bg-primary/20 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:border-primary focus:ring-primary " + (error ? "border-red-500" : "")}
      />
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder, error }: any) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black/70 dark:text-white/70">{label}</span>
      <textarea
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        className={"form-textarea mt-1 block w-full rounded-lg border-primary/20 bg-primary/10 dark:bg-primary/20 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:border-primary focus:ring-primary min-h-32 " + (error ? "border-red-500" : "")}
      />
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

function Amenity({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
      <input
        type="checkbox"
        checked={checked}
        onChange={e=>onChange(e.target.checked)}
        className="form-checkbox h-5 w-5 rounded text-primary bg-transparent border-primary/50 focus:ring-primary"
      />
      <span className="ml-3 text-sm text-black dark:text-white">{label}</span>
    </label>
  );
}

function ColorInput({ label, value, onChange, error }: any) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-black/70 dark:text-white/70">{label}</span>
      <div className="relative mt-1">
        <input
          value={value}
          onChange={e=>onChange(e.target.value)}
          className={"form-input block w-full pl-10 rounded-lg border-primary/20 bg-primary/10 dark:bg-primary/20 text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 focus:border-primary focus:ring-primary " + (error ? "border-red-500" : "")}
          type="text"
        />
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="w-5 h-5 rounded-full" style={{ backgroundColor: value }} />
        </span>
      </div>
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
