import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Infinity as InfinityIcon, LogOut, Sparkles, BarChart3, CalendarDays, Send, Mic2, Video, BrainCircuit, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ShareOn" }] }),
  component: Dashboard,
});

type Profile = { full_name: string | null; email: string; plan: string; company: string | null };

function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,email,plan,company").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  const firstName = profile?.full_name?.split(" ")[0] ?? profile?.email?.split("@")[0] ?? "Creator";

  const stats = [
    { label: "Brand momentum", value: "84.6", delta: "+12.4%", icon: BarChart3 },
    { label: "Voice match", value: "97.4%", delta: "Live", icon: Mic2 },
    { label: "Content ready", value: "18", delta: "assets", icon: Sparkles },
    { label: "Posts this week", value: "12", delta: "+3", icon: Send },
  ];

  const modules = [
    { name: "AI Content Studio", copy: "Generate posts, threads, scripts, carousels.", icon: Sparkles },
    { name: "Brand Voice AI", copy: "Train the model on your strongest work.", icon: Mic2 },
    { name: "Content Calendar", copy: "Plan, schedule, and publish across channels.", icon: CalendarDays },
    { name: "Analytics Intelligence", copy: "Performance signals → next best move.", icon: BarChart3 },
    { name: "Avatar Studio", copy: "Studio-quality video with your digital presenter.", icon: Video },
    { name: "ShareOn Intelligence", copy: "Predictive recommendations and trends.", icon: BrainCircuit },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="cosmic-halo absolute inset-0 opacity-50" />

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/70 px-6 py-4 backdrop-blur-2xl">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-primary)]"><InfinityIcon className="size-5" /></span>
          ShareOn
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-border bg-surface-1 px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground sm:inline">{profile?.plan ?? "spark"} plan</span>
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); toast.success("Signed out."); }}><LogOut className="size-4" /> Sign out</Button>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[.22em] text-cosmic">Command center</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-.04em] md:text-6xl">Welcome back, <span className="font-display font-normal italic text-gradient-ai">{firstName}.</span></h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Your personal branding OS is ready. Pick a module to keep building.</p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-panel gradient-border rounded-2xl p-5">
                <div className="flex items-center justify-between"><Icon className="size-5 text-glow" /><span className="text-xs text-cosmic">{s.delta}</span></div>
                <p className="mt-6 text-3xl font-bold tracking-tight">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <motion.button
                key={m.name}
                whileHover={{ y: -4 }}
                onClick={() => toast.info(`${m.name} ships next — we'll email you when it's live.`)}
                className="gradient-border group relative overflow-hidden rounded-[1.8rem] bg-surface-2 p-7 text-left"
              >
                <div className="flex items-start justify-between">
                  <Icon className="size-6 text-glow" />
                  <ArrowUpRight className="size-5 text-muted-foreground transition group-hover:text-foreground" />
                </div>
                <h3 className="mt-8 text-xl font-bold">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.copy}</p>
                <span className="mt-5 inline-block rounded-full bg-cosmic/10 px-3 py-1 text-xs text-cosmic">Coming soon</span>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-12 glass-panel gradient-border rounded-[2rem] p-8">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-gold">Your account</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <Info label="Email" value={profile?.email ?? user?.email ?? "—"} />
            <Info label="Company" value={profile?.company ?? "—"} />
            <Info label="Plan" value={profile?.plan ?? "spark"} />
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-base font-semibold">{value}</p>
    </div>
  );
}
