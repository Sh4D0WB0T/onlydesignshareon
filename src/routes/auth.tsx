import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Infinity as InfinityIcon } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — ShareOn" },
      { name: "description", content: "Sign in or create your ShareOn account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode = "signup", redirect } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: redirect ?? "/dashboard" });
  }, [user, loading, navigate, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome to ShareOn.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const requestReset = async () => {
    if (!email) return toast.error("Enter your email first.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=signin`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent.");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16">
      <div className="cosmic-halo absolute inset-0 opacity-70" />
      <Link to="/" className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
        <ArrowLeft className="size-4" /> Back home
      </Link>

      <motion.div
        className="glass-panel gradient-border relative w-full max-w-md overflow-hidden rounded-[2rem] p-8"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-primary)]"><InfinityIcon className="size-5" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-cosmic">ShareOn</p>
            <h1 className="text-2xl font-bold tracking-tight">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <Field label="Full name">
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldCls} placeholder="Maya Chen" />
            </Field>
          )}
          <Field label="Email">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} placeholder="you@company.com" autoComplete="email" />
          </Field>
          <Field label="Password">
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldCls} placeholder="At least 8 characters" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </Field>

          <Button type="submit" variant="hero" size="lg" className="mt-2 w-full" disabled={submitting}>
            {submitting ? <><Loader2 className="animate-spin" /> Working…</> : <>{mode === "signup" ? "Create account" : "Sign in"} <ArrowRight /></>}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-muted-foreground transition hover:text-foreground">
            {mode === "signup" ? "Have an account? Sign in" : "New here? Create account"}
          </button>
          {mode === "signin" && (
            <button onClick={requestReset} className="text-muted-foreground transition hover:text-foreground">Forgot password?</button>
          )}
        </div>
      </motion.div>
    </main>
  );
}

const fieldCls = "w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none transition focus:border-primary";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
