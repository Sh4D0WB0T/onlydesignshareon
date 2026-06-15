import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  creator_type: z.string().max(80).optional(),
  platform_focus: z.string().max(80).optional(),
});

const creatorTypes = ["Founder", "Solo creator", "Executive", "Coach / consultant", "Marketing team", "Other"];
const platforms = ["LinkedIn", "X / Twitter", "Instagram", "YouTube", "TikTok", "All of them"];

export function WaitlistDialog({ open, onClose, children }: { open: boolean; onClose: () => void; children?: ReactNode }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", company: "", creator_type: creatorTypes[0], platform_focus: platforms[0] });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("waitlist_entries").insert({
      ...parsed.data,
      company: parsed.data.company || null,
      source_page: typeof window !== "undefined" ? window.location.pathname : null,
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") toast.success("You're already on the waitlist — see you soon.");
      else toast.error(error.message);
      return;
    }
    setDone(true);
  };

  const close = () => {
    onClose();
    setTimeout(() => setDone(false), 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-background/85 px-4 backdrop-blur-2xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="glass-panel gradient-border w-full max-w-lg overflow-hidden rounded-[2rem]"
            initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-cosmic">{done ? "You're in" : "Join the waitlist"}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{done ? "Welcome to ShareOn." : "Be first to ship your brand."}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={close} aria-label="Close"><X /></Button>
            </div>

            {done ? (
              <div className="p-6 text-center">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-cosmic/15 text-cosmic"><Check className="size-7" /></div>
                <p className="text-base text-muted-foreground">We'll email <strong className="text-foreground">{form.email}</strong> the moment your seat is ready.</p>
                <Button variant="hero" size="lg" className="mt-7 w-full" onClick={close}>Continue exploring</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 p-6">
                {children}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} className={fieldCls} placeholder="Maya Chen" /></Field>
                  <Field label="Work email"><input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={fieldCls} placeholder="maya@studio.com" /></Field>
                </div>
                <Field label="Company (optional)"><input value={form.company} onChange={(e) => set("company", e.target.value)} className={fieldCls} placeholder="Fieldnotes Studio" /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="You are a…"><select value={form.creator_type} onChange={(e) => set("creator_type", e.target.value)} className={fieldCls}>{creatorTypes.map((o) => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Main platform"><select value={form.platform_focus} onChange={(e) => set("platform_focus", e.target.value)} className={fieldCls}>{platforms.map((o) => <option key={o}>{o}</option>)}</select></Field>
                </div>
                <Button type="submit" variant="hero" size="lg" className="mt-2 w-full" disabled={submitting}>
                  {submitting ? <><Loader2 className="animate-spin" /> Saving…</> : "Reserve my spot"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">No spam. We email once: when your seat opens.</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const fieldCls = "w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition focus:border-primary";
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
