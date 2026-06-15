import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, CalendarCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1, "Company is required").max(120),
  team_size: z.string().max(40).optional(),
  monthly_content_volume: z.string().max(40).optional(),
  notes: z.string().max(1000).optional(),
});

const teamSizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const volumes = ["< 30 posts/mo", "30-100 posts/mo", "100-500 posts/mo", "500+ posts/mo"];

export function DemoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", company: "", team_size: teamSizes[1], monthly_content_volume: volumes[1], notes: "" });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please fix the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("enterprise_demo_requests").insert({
      ...parsed.data,
      notes: parsed.data.notes || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
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
            className="glass-panel gradient-border w-full max-w-xl overflow-hidden rounded-[2rem]"
            initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">{done ? "Request received" : "Book enterprise demo"}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{done ? "We'll reach out within 24 hours." : "Tailored walkthrough for your team."}</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={close} aria-label="Close"><X /></Button>
            </div>

            {done ? (
              <div className="p-6 text-center">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-gold/20 text-gold"><CalendarCheck className="size-7" /></div>
                <p className="text-base text-muted-foreground">A ShareOn strategist will reach <strong className="text-foreground">{form.email}</strong> with available times.</p>
                <Button variant="gold" size="lg" className="mt-7 w-full" onClick={close}>Close</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} className={fieldCls} /></Field>
                  <Field label="Work email"><input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={fieldCls} /></Field>
                </div>
                <Field label="Company"><input required value={form.company} onChange={(e) => set("company", e.target.value)} className={fieldCls} /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Team size"><select value={form.team_size} onChange={(e) => set("team_size", e.target.value)} className={fieldCls}>{teamSizes.map((o) => <option key={o}>{o}</option>)}</select></Field>
                  <Field label="Monthly content volume"><select value={form.monthly_content_volume} onChange={(e) => set("monthly_content_volume", e.target.value)} className={fieldCls}>{volumes.map((o) => <option key={o}>{o}</option>)}</select></Field>
                </div>
                <Field label="What are you hoping to achieve? (optional)"><textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={fieldCls} placeholder="Help us prepare the right walkthrough for your team." /></Field>
                <Button type="submit" variant="gold" size="lg" className="mt-2 w-full" disabled={submitting}>
                  {submitting ? <><Loader2 className="animate-spin" /> Sending…</> : "Request my demo"}
                </Button>
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
