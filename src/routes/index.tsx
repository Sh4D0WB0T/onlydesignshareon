import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Activity, ArrowRight, Atom, BarChart3, BookOpen, Boxes, BrainCircuit, CalendarDays,
  Check, ChevronRight, CirclePlay, Command, Database, FileText, Globe2, Infinity as InfinityIcon,
  Layers3, Menu, MessageCircle, Mic2, Network, Play, Search, Send, Sparkles, UploadCloud,
  Video, WandSparkles, X, Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { CosmicScene } from "@/components/cosmic-scene";
import creatorsImage from "@/assets/shareon-creators.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShareOn Enterprise — AI Personal Branding OS" },
      { name: "description", content: "Turn your expertise into videos, social content, and automated publishing with the AI personal branding operating system." },
      { property: "og:title", content: "ShareOn Enterprise — AI Personal Branding OS" },
      { property: "og:description", content: "Transform your knowledge into a brand that compounds across every platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = ["Features", "Solutions", "Pricing", "Resources", "About"];
const rotatingWords = ["authority", "influence", "opportunity", "momentum"];
const storyScenes = [
  { number: "01", eyebrow: "Knowledge, trapped", title: "Your best ideas are hiding in plain sight.", body: "Documents. Calls. Voice notes. Years of expertise. Your intellectual capital is scattered across formats built for storage—not growth.", icon: FileText },
  { number: "02", eyebrow: "Signal overload", title: "Consistency became a full-time job.", body: "Every platform demands a new format, cadence, and voice. The work of being visible eclipses the work that made you valuable.", icon: Layers3 },
  { number: "03", eyebrow: "The transformation", title: "ShareOn turns knowledge into an intelligent system.", body: "One source becomes a coordinated content universe—grounded in your expertise, calibrated to your voice, ready for every channel.", icon: BrainCircuit },
  { number: "04", eyebrow: "Brand Voice AI", title: "It learns what makes you unmistakably you.", body: "Cadence, conviction, stories, language, and point of view become a living identity model that evolves with every idea.", icon: Mic2 },
  { number: "05", eyebrow: "Avatar Studio", title: "Your presence, multiplied.", body: "Generate studio-quality video with a digital presenter that looks, sounds, and communicates like you—at the speed of thought.", icon: Video },
  { number: "06", eyebrow: "Content Engine", title: "Create once. Become everywhere.", body: "Long-form insight branches into posts, threads, scripts, carousels, newsletters, and content calendars in a single intelligent flow.", icon: WandSparkles },
  { number: "07", eyebrow: "Publishing Hub", title: "Every channel moves as one.", body: "Approve, schedule, adapt, and publish across your entire presence from one calm, coordinated command center.", icon: Send },
  { number: "08", eyebrow: "Analytics intelligence", title: "Know what creates momentum.", body: "ShareOn connects content performance to audience signals and tells you what to say next—not just what happened last.", icon: BarChart3 },
  { number: "09", eyebrow: "Compounding growth", title: "Your personal brand becomes an asset.", body: "More visibility. Deeper trust. A repeatable engine for opportunities that keeps working while you do your most important work.", icon: InfinityIcon },
];

const modules = [
  { name: "Brand Voice AI", copy: "A living identity model trained on your strongest work.", stat: "97.4%", label: "voice match", icon: Mic2, className: "md:col-span-7 md:row-span-2" },
  { name: "Avatar Studio", copy: "Your digital presence, ready for any script.", stat: "4K", label: "studio output", icon: Video, className: "md:col-span-5 md:row-span-3" },
  { name: "Content Engine", copy: "One idea, orchestrated into every format.", stat: "12×", label: "faster creation", icon: Sparkles, className: "md:col-span-4 md:row-span-2" },
  { name: "Publishing Hub", copy: "Precision scheduling across every channel.", stat: "8", label: "platforms", icon: Send, className: "md:col-span-8 md:row-span-2" },
  { name: "Analytics Intelligence", copy: "Signals become a clear next move.", stat: "+42%", label: "avg. reach", icon: BarChart3, className: "md:col-span-7 md:row-span-2" },
  { name: "Knowledge Base", copy: "Every insight indexed, connected, and ready.", stat: "∞", label: "context", icon: Database, className: "md:col-span-5 md:row-span-2" },
];

const architecture = [
  { name: "Experience", detail: "Adaptive interfaces across web, mobile, and embedded workflows.", metric: "24 ms", icon: Boxes },
  { name: "Intelligence Gateway", detail: "Routes every request through the right model and context window.", metric: "99.99%", icon: Network },
  { name: "Knowledge Engine", detail: "Maps source material into concepts, stories, claims, and evidence.", metric: "1.8B", icon: BrainCircuit },
  { name: "Brand Voice AI", detail: "Maintains identity, tone, vocabulary, and point of view at scale.", metric: "97.4%", icon: Mic2 },
  { name: "Publishing Layer", detail: "Adapts, schedules, and distributes content across every channel.", metric: "8 channels", icon: Send },
  { name: "Analytics Layer", detail: "Closes the loop with performance-aware recommendations.", metric: "+42%", icon: BarChart3 },
];

function MagneticButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });
  const move = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  };
  return <motion.div style={{ x: springX, y: springY }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0); }}><Button {...props}>{children}</Button></motion.div>;
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const commands = [
    ["Open Features", "features"], ["Open Pricing", "pricing"], ["Book Demo", "pricing"],
    ["Contact Team", "footer"], ["Open Analytics", "metrics"], ["Open Integrations", "architecture"],
    ["Open Documentation", "footer"], ["Start Free Trial", "sandbox"],
  ];
  const filtered = commands.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => setSelected(0), [query]);
  const choose = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); onClose(); };
  return (
    <AnimatePresence>
      {open && <motion.div className="fixed inset-0 z-[100] flex items-start justify-center bg-background/90 px-4 pt-[12vh] backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="glass-panel gradient-border w-full max-w-2xl overflow-hidden rounded-[2rem]" initial={{ y: 30, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: .97 }} onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center gap-4 border-b border-border px-6 py-5"><Search className="text-muted-foreground" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowDown") setSelected((selected + 1) % filtered.length); if (event.key === "ArrowUp") setSelected((selected - 1 + filtered.length) % filtered.length); if (event.key === "Enter" && filtered[selected]) choose(filtered[selected][1]); if (event.key === "Escape") onClose(); }} placeholder="Where do you want to go?" className="w-full bg-transparent text-xl outline-none placeholder:text-muted-foreground" /><kbd className="rounded-lg border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">ESC</kbd></div>
          <div className="p-3"><p className="px-4 py-3 text-xs font-semibold uppercase tracking-[.2em] text-muted-foreground">{query ? "Results" : "Recent actions"}</p>{filtered.map(([label, id], index) => <button key={label} onMouseEnter={() => setSelected(index)} onClick={() => choose(id)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition ${selected === index ? "bg-accent text-foreground" : "text-muted-foreground"}`}><span className="flex items-center gap-3"><Command className="size-4" />{label}</span><ChevronRight className="size-4" /></button>)}</div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  );
}

function Counter({ value, label }: { value: string; label: string }) {
  return <div><p className="text-2xl font-bold tracking-tight md:text-4xl">{value}</p><p className="mt-1 text-xs uppercase tracking-[.16em] text-muted-foreground">{label}</p></div>;
}

function Index() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [yearly, setYearly] = useState(true);
  const [activeNode, setActiveNode] = useState(2);
  const [sandboxType, setSandboxType] = useState("LinkedIn Post");
  const [sandboxReady, setSandboxReady] = useState(false);
  const [word, setWord] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, [0, 1], ["15%", "85%"]);
  const glowY = useTransform(mouseY, [0, 1], ["10%", "90%"]);

  useEffect(() => {
    const wordTimer = window.setInterval(() => setWord((current) => (current + 1) % rotatingWords.length), 2800);
    const keyHandler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen(true); }
    };
    window.addEventListener("keydown", keyHandler);
    return () => { window.clearInterval(wordTimer); window.removeEventListener("keydown", keyHandler); };
  }, []);

  const activeArchitecture = architecture[activeNode];
  const ActiveArchitectureIcon = activeArchitecture.icon;
  const prices = useMemo(() => yearly ? [0, 29, 79] : [0, 39, 99], [yearly]);
  const submitSandbox = (event: FormEvent) => { event.preventDefault(); setSandboxReady(false); window.setTimeout(() => setSandboxReady(true), 900); };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background" onMouseMove={(event) => { mouseX.set(event.clientX / window.innerWidth); mouseY.set(event.clientY / window.innerHeight); }}>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <motion.div className="pointer-events-none fixed z-0 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-[120px]" style={{ left: glowX, top: glowY }} />

      <header className="fixed inset-x-0 top-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-6xl items-center justify-between rounded-full border border-border bg-background/65 px-3 py-2 shadow-[var(--shadow-ambient)] backdrop-blur-2xl md:top-6 md:px-4">
        <a href="#top" className="flex items-center gap-2 px-2 font-bold tracking-tight"><span className="flex size-8 items-center justify-center rounded-xl bg-primary shadow-[var(--shadow-primary)]"><InfinityIcon className="size-5" /></span>ShareOn</a>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground">{item}</a>)}</nav>
        <div className="flex items-center gap-2"><Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log in</Button><Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => setPaletteOpen(true)}><Command />K</Button><Button variant="hero" size="sm">Start free <ArrowRight /></Button><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button></div>
      </header>

      <section id="top" className="noise relative flex min-h-[105svh] items-center pt-28">
        <div className="cosmic-halo absolute inset-0" />
        <div className="absolute inset-y-0 right-0 w-full opacity-80 lg:w-[58%]"><CosmicScene /></div>
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-glow"><span className="size-1.5 animate-pulse rounded-full bg-primary" />ShareOn Enterprise · Now live</div>
            <h1 className="max-w-4xl text-[clamp(4rem,8vw,7.8rem)] font-black leading-[.82] tracking-[-.075em]">Turn expertise into <span className="font-display font-normal italic text-gradient-ai">{rotatingWords[word]}.</span></h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">The AI personal branding operating system that transforms your knowledge into a brand that compounds—across every format, channel, and moment.</p>
            <div className="mt-10 flex flex-wrap items-center gap-4"><MagneticButton variant="hero" size="xl">Start building your brand <ArrowRight /></MagneticButton><MagneticButton variant="glass" size="xl"><CirclePlay /> Watch live demo</MagneticButton></div>
            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground"><div className="flex -space-x-2">{["S", "A", "M", "J"].map((letter) => <span key={letter} className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-surface-3 text-xs font-bold text-foreground">{letter}</span>)}</div><p><strong className="text-foreground">4,200+</strong> experts building in public</p></div>
          </motion.div>

          <motion.div className="relative mx-auto w-full max-w-xl pt-12 lg:pt-0" initial={{ opacity: 0, scale: .9, rotateY: 8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ delay: .25, duration: 1 }}>
            <motion.div drag dragConstraints={{ left: -28, right: 28, top: -28, bottom: 28 }} className="glass-panel gradient-border relative overflow-hidden rounded-[2rem] p-3" whileHover={{ y: -6 }}>
              <div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-primary" /><span className="size-2 rounded-full bg-gold" /><span className="size-2 rounded-full bg-cosmic" /></div><span className="text-xs text-muted-foreground">SHAREON / COMMAND CENTER</span><Activity className="size-4 text-glow" /></div>
              <div className="grid gap-3 p-3 sm:grid-cols-[1.35fr_.65fr]">
                <div className="rounded-[1.4rem] bg-surface-1 p-5"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.15em] text-muted-foreground">Brand momentum</p><p className="mt-2 text-4xl font-bold">84.6</p></div><span className="rounded-full bg-cosmic/15 px-3 py-1 text-xs text-glow">+12.4%</span></div><div className="mt-8 flex h-28 items-end gap-1">{[35,55,42,67,52,76,64,88,72,96,82,100].map((height, index) => <motion.span key={index} className="w-full rounded-t-sm bg-gradient-to-t from-primary to-cosmic" initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: .7 + index * .05 }} />)}</div></div>
                <div className="space-y-3"><div className="rounded-[1.4rem] bg-surface-2 p-4"><p className="text-xs text-muted-foreground">Voice match</p><p className="mt-3 text-2xl font-bold">97.4%</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><motion.div className="h-full rounded-full bg-cosmic" initial={{ width: 0 }} animate={{ width: "97%" }} transition={{ delay: 1, duration: 1 }} /></div></div><div className="rounded-[1.4rem] bg-surface-2 p-4"><p className="text-xs text-muted-foreground">Content ready</p><p className="mt-3 text-2xl font-bold">18 <span className="text-sm font-normal text-muted-foreground">assets</span></p></div></div>
              </div>
              <div className="mx-3 mb-3 rounded-[1.4rem] border border-border bg-surface-1 p-4"><div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold">Live generation</p><span className="flex items-center gap-2 text-xs text-cosmic"><span className="size-1.5 animate-pulse rounded-full bg-cosmic" />thinking</span></div>{["Extracting 12 key insights", "Calibrating founder voice", "Building multi-channel campaign"].map((item, index) => <div key={item} className="flex items-center gap-3 border-t border-border py-3 text-xs text-muted-foreground"><span className={`size-6 rounded-lg ${index === 2 ? "shimmer bg-accent" : "bg-primary/15"}`} />{item}{index < 2 && <Check className="ml-auto size-3 text-cosmic" />}</div>)}</div>
            </motion.div>
            <motion.div drag className="glass-panel absolute -left-7 top-0 rounded-2xl px-4 py-3 text-xs shadow-[var(--shadow-ambient)]" animate={{ y: [0,-8,0] }} transition={{ repeat: Infinity, duration: 5 }}><Sparkles className="mb-2 text-gold" />Hidden capability<br/><strong className="text-foreground">Idea graph unlocked</strong></motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-y border-border bg-surface-1/80 py-6"><div className="animate-ticker flex w-max items-center gap-14 pr-14 text-sm font-semibold text-muted-foreground">{[...Array(2)].flatMap(() => ["4,200+ active creators", "1.8M assets generated", "68 countries", "99.99% uptime", "SOC 2 ready", "12× faster creation"]).map((item, index) => <span key={`${item}-${index}`} className="flex items-center gap-3 whitespace-nowrap"><span className="size-1 rounded-full bg-primary" />{item}</span>)}</div></section>

      <section id="features" className="relative py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mb-24 max-w-4xl"><p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-primary">From fragmented to formidable</p><h2 className="text-5xl font-bold leading-[.95] tracking-[-.055em] md:text-7xl">Nine moments.<br/><span className="font-display font-normal italic text-gradient-ai">One compounding system.</span></h2></div>
          <div className="space-y-5">{storyScenes.map((scene, index) => { const Icon = scene.icon; return <motion.article key={scene.number} className="group grid min-h-[55vh] items-center gap-10 border-t border-border py-20 md:grid-cols-[.35fr_1.3fr_1fr]" initial={{ opacity: .25 }} whileInView={{ opacity: 1 }} viewport={{ amount: .55 }} transition={{ duration: .6 }}><span className="font-display text-7xl text-muted-foreground/20 transition group-hover:text-primary/40">{scene.number}</span><div><p className="mb-5 text-sm font-semibold uppercase tracking-[.2em] text-cosmic">{scene.eyebrow}</p><h3 className="text-4xl font-bold leading-tight tracking-[-.04em] md:text-6xl">{scene.title}</h3></div><div><div className="mb-8 flex size-20 items-center justify-center rounded-[1.7rem] border border-border bg-surface-glass text-glow backdrop-blur-xl transition duration-500 group-hover:rotate-6 group-hover:scale-110"><Icon className="size-8" /></div><p className="text-lg leading-relaxed text-muted-foreground">{scene.body}</p></div></motion.article>; })}</div>
        </div>
      </section>

      <section id="solutions" className="relative py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-primary">The operating system</p><h2 className="max-w-3xl text-5xl font-bold leading-[.95] tracking-[-.05em] md:text-7xl">Six engines.<br/><span className="font-display font-normal italic text-gradient-ai">One voice.</span></h2></div><p className="max-w-sm text-lg leading-relaxed text-muted-foreground">Every module shares context. Every output makes the entire system smarter.</p></div><div className="grid auto-rows-[11rem] gap-4 md:grid-cols-12">{modules.map((module) => { const Icon = module.icon; return <motion.article key={module.name} className={`gradient-border group relative overflow-hidden rounded-[2rem] bg-surface-2 p-7 ${module.className}`} whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}><div className="absolute -right-16 -top-16 size-48 rounded-full bg-electric/10 blur-3xl transition group-hover:bg-primary/15"/><div className="relative flex h-full flex-col justify-between"><div className="flex items-start justify-between"><Icon className="size-7 text-glow"/><ArrowRight className="size-5 -rotate-45 text-muted-foreground transition group-hover:rotate-0 group-hover:text-foreground" /></div><div><h3 className="text-2xl font-bold tracking-tight">{module.name}</h3><p className="mt-2 max-w-md text-sm text-muted-foreground">{module.copy}</p></div><div className="absolute bottom-7 right-7 text-right"><p className="text-4xl font-bold text-gradient-ai">{module.stat}</p><p className="text-xs uppercase tracking-wider text-muted-foreground">{module.label}</p></div></div></motion.article>; })}</div></div></section>

      <section id="architecture" className="relative py-32 md:py-48"><div className="cosmic-halo absolute inset-0 opacity-60"/><div className="relative mx-auto max-w-7xl px-6 lg:px-8"><div className="mx-auto mb-20 max-w-3xl text-center"><p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-cosmic">Explore the intelligence layer</p><h2 className="text-5xl font-bold tracking-[-.055em] md:text-7xl">An architecture that <span className="font-display font-normal italic text-gradient-ai">thinks in systems.</span></h2></div><div className="glass-panel gradient-border grid overflow-hidden rounded-[2.2rem] lg:grid-cols-[.9fr_1.1fr]"><div className="border-b border-border p-5 lg:border-b-0 lg:border-r">{architecture.map((node, index) => { const Icon = node.icon; return <button key={node.name} onClick={() => setActiveNode(index)} className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition ${activeNode === index ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}><span className={`flex size-11 items-center justify-center rounded-xl ${activeNode === index ? "bg-primary text-primary-foreground" : "bg-muted"}`}><Icon className="size-5" /></span><span><strong className="block text-sm text-foreground">{node.name}</strong><span className="text-xs">Layer 0{index + 1}</span></span><ChevronRight className="ml-auto size-4" /></button>; })}</div><AnimatePresence mode="wait"><motion.div key={activeNode} className="relative flex min-h-[34rem] flex-col justify-between overflow-hidden p-8 md:p-12" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><div className="absolute inset-0 opacity-70"><CosmicScene /></div><div className="relative flex justify-between"><span className="rounded-full border border-border bg-background/60 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground">Active architecture node</span><span className="text-sm text-cosmic">Healthy · 100%</span></div><div className="relative"><div className="mb-8 flex size-20 items-center justify-center rounded-[1.8rem] bg-primary shadow-[var(--shadow-primary)]"><ActiveArchitectureIcon className="size-9" /></div><p className="text-6xl font-black tracking-[-.06em]">{activeArchitecture.metric}</p><h3 className="mt-6 text-3xl font-bold">{activeArchitecture.name}</h3><p className="mt-3 max-w-lg text-lg leading-relaxed text-muted-foreground">{activeArchitecture.detail}</p><div className="mt-8 flex flex-wrap gap-3">{["Encrypted", "Adaptive", "Observable"].map((tag) => <span key={tag} className="rounded-full border border-border bg-surface-glass px-3 py-1.5 text-xs text-muted-foreground">{tag}</span>)}</div></div></motion.div></AnimatePresence></div></div></section>

      <section id="metrics" className="py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-primary">Live build in public</p><h2 className="text-5xl font-bold leading-none tracking-[-.05em] md:text-7xl">The network is <span className="font-display font-normal italic text-gradient-ai">alive.</span></h2><p className="mt-6 max-w-md text-lg text-muted-foreground">Every pulse is a creator turning what they know into something the world can use.</p></div><div className="glass-panel gradient-border rounded-[2rem] p-6 md:p-9"><div className="grid grid-cols-2 gap-8 border-b border-border pb-8 md:grid-cols-4"><Counter value="4,286" label="Creators active"/><Counter value="1.8M" label="Assets generated"/><Counter value="12.4M" label="Posts published"/><Counter value="68" label="Countries reached"/></div><div className="mt-8 grid gap-8 md:grid-cols-[1.25fr_.75fr]"><div className="relative min-h-64 overflow-hidden rounded-[1.5rem] bg-surface-1 p-5"><div className="absolute left-[16%] top-[35%] size-3 animate-ping rounded-full bg-primary"/><div className="absolute left-[45%] top-[28%] size-2 animate-pulse rounded-full bg-cosmic"/><div className="absolute right-[18%] top-[48%] size-3 animate-ping rounded-full bg-gold"/><Globe2 className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/10"/><p className="relative text-xs uppercase tracking-widest text-muted-foreground">World activity / live</p></div><div><p className="mb-4 text-sm font-semibold">Streaming now</p>{["Maya published a video", "Jon trained his voice", "Ari generated 8 posts", "Noah reached 10K views"].map((item,index) => <motion.div key={item} className="flex gap-3 border-t border-border py-3 text-xs text-muted-foreground" initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * .12 }}><span className="mt-1 size-1.5 rounded-full bg-cosmic"/>{item}<span className="ml-auto">now</span></motion.div>)}</div></div></div></div></div></section>

      <section id="sandbox" className="py-28 md:py-44"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mx-auto mb-16 max-w-3xl text-center"><p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-gold">No signup. No friction.</p><h2 className="text-5xl font-bold tracking-[-.055em] md:text-7xl">Give us one idea.<br/><span className="font-display font-normal italic text-gradient-premium">Watch it multiply.</span></h2></div><form onSubmit={submitSandbox} className="glass-panel gradient-border mx-auto max-w-5xl rounded-[2.2rem] p-4 md:p-8"><div className="grid gap-4 lg:grid-cols-2"><label className="group flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-border bg-surface-1 p-8 text-center transition hover:border-primary/50 hover:bg-surface-2"><input type="file" className="sr-only" accept=".pdf,.txt,.doc,.docx"/><span className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:scale-110"><UploadCloud className="size-7"/></span><strong className="text-xl">Drop your knowledge here</strong><span className="mt-2 text-sm text-muted-foreground">PDF, resume, notes, blog, or article</span><span className="mt-6 rounded-full border border-border px-4 py-2 text-xs">Choose a file</span></label><div className="flex min-h-80 flex-col rounded-[1.7rem] bg-surface-2 p-6"><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Create instantly</p><div className="mt-4 flex flex-wrap gap-2">{["LinkedIn Post","X Thread","Content Calendar","Video Script"].map((type) => <button type="button" key={type} onClick={() => setSandboxType(type)} className={`rounded-full px-3 py-2 text-xs transition ${sandboxType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{type}</button>)}</div><AnimatePresence mode="wait">{sandboxReady ? <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex-1 rounded-2xl border border-cosmic/20 bg-cosmic/5 p-5"><span className="text-xs text-cosmic">Generated {sandboxType}</span><p className="mt-4 text-lg font-semibold">The most valuable ideas aren’t always the loudest.</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">They’re the ones earned through experience—then shaped into something others can act on. Here are three lessons I wish I knew sooner...</p></motion.div> : <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border border-border text-center text-muted-foreground"><Sparkles className="mb-4 size-8"/><p>Your generated content will appear here.</p></div>}</AnimatePresence><Button type="submit" variant="hero" size="lg" className="mt-4 w-full">Generate with ShareOn <WandSparkles /></Button></div></div></form></div></section>

      <section id="about" className="relative py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="overflow-hidden rounded-[2.5rem] bg-surface-1"><div className="grid lg:grid-cols-2"><img src={creatorsImage} alt="Three ShareOn creators in a cinematic studio" loading="lazy" width={1536} height={1024} className="h-full min-h-[32rem] w-full object-cover"/><div className="flex flex-col justify-center p-8 md:p-16"><p className="text-sm font-semibold uppercase tracking-[.25em] text-primary">Built for people with something to say</p><blockquote className="mt-8 text-3xl font-semibold leading-tight tracking-[-.035em] md:text-5xl">“ShareOn didn’t make me sound like everyone else. It finally made my ideas sound more like <span className="font-display italic text-gradient-ai">me.</span>”</blockquote><div className="mt-10"><p className="font-semibold">Maya Chen</p><p className="text-sm text-muted-foreground">Founder, Fieldnotes Studio · 3.2× audience growth</p></div><div className="mt-10 flex gap-3"><Button variant="glass" size="icon" aria-label="Previous story"><ChevronRight className="rotate-180"/></Button><Button variant="glass" size="icon" aria-label="Next story"><ChevronRight/></Button></div></div></div></div></div></section>

      <section id="pricing" className="py-32 md:py-48"><div className="mx-auto max-w-7xl px-6 lg:px-8"><div className="mb-16 text-center"><p className="mb-5 text-sm font-semibold uppercase tracking-[.25em] text-primary">Simple by design</p><h2 className="text-5xl font-bold tracking-[-.055em] md:text-7xl">Start where you are.<br/><span className="font-display font-normal italic text-gradient-ai">Scale who you become.</span></h2><button onClick={() => setYearly(!yearly)} className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-surface-1 p-1 text-sm"><span className={`rounded-full px-4 py-2 ${!yearly ? "bg-accent" : "text-muted-foreground"}`}>Monthly</span><span className={`rounded-full px-4 py-2 ${yearly ? "bg-accent" : "text-muted-foreground"}`}>Yearly <span className="text-cosmic">−20%</span></span></button></div><div className="grid gap-5 lg:grid-cols-3">{[
          {name:"Spark",copy:"Begin building your signal.",features:["3 knowledge sources","15 assets / month","2 social channels"]},
          {name:"Creator",copy:"Turn consistency into momentum.",features:["Unlimited sources","150 assets / month","Brand Voice AI","All publishing channels"]},
          {name:"Pro",copy:"Your complete personal brand OS.",features:["Everything in Creator","Avatar Studio","Advanced analytics","Priority intelligence"]},
        ].map((plan,index) => <motion.article key={plan.name} whileHover={{ y: -8 }} className={`gradient-border relative rounded-[2rem] p-8 ${index === 2 ? "bg-gold text-gold-foreground shadow-[var(--shadow-gold)]" : "glass-panel"}`}>{index === 2 && <span className="absolute right-5 top-5 rounded-full bg-background px-3 py-1 text-xs text-foreground">Recommended</span>}<p className="text-sm font-semibold uppercase tracking-widest opacity-70">{plan.name}</p><p className="mt-6 text-5xl font-bold">${prices[index]}<span className="text-base font-normal opacity-60"> / mo</span></p><p className="mt-4 opacity-70">{plan.copy}</p><ul className="my-8 space-y-4">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-3 text-sm"><Check className="size-4"/>{feature}</li>)}</ul><Button variant={index === 2 ? "default" : "glass"} size="lg" className="w-full">{index === 0 ? "Start free" : "Choose " + plan.name}<ArrowRight/></Button></motion.article>)}</div></div></section>

      <section className="relative px-6 py-28"><div className="gradient-border relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-surface-2 px-6 py-24 text-center md:px-16 md:py-32"><div className="cosmic-halo absolute inset-0"/><div className="absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cosmic/15"/><div className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15"/><div className="relative"><p className="mb-6 text-sm font-semibold uppercase tracking-[.25em] text-gold">Your expertise is already valuable</p><h2 className="mx-auto max-w-5xl text-5xl font-black leading-[.92] tracking-[-.06em] md:text-8xl">Make it <span className="font-display font-normal italic text-gradient-ai">impossible to ignore.</span></h2><p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground">Build the personal brand operating system that turns what you know into opportunities that compound.</p><div className="mt-10 flex flex-wrap justify-center gap-4"><MagneticButton variant="hero" size="xl">Start your free trial <ArrowRight/></MagneticButton><MagneticButton variant="glass" size="xl">Book enterprise demo</MagneticButton></div><p className="mt-6 text-xs text-muted-foreground">No credit card · Setup in 4 minutes · Cancel anytime</p></div></div></section>

      <footer id="footer" className="border-t border-border px-6 pb-10 pt-24"><div className="mx-auto max-w-7xl"><div className="grid gap-14 md:grid-cols-2 lg:grid-cols-6"><div className="lg:col-span-2"><a href="#top" className="flex items-center gap-2 text-xl font-bold"><span className="flex size-9 items-center justify-center rounded-xl bg-primary"><InfinityIcon/></span>ShareOn</a><p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">The AI personal branding operating system for people building what’s next.</p><div className="mt-7 flex gap-2">{[Globe2,MessageCircle,Play].map((Icon,index)=><Button key={index} variant="glass" size="icon" aria-label="Social link"><Icon/></Button>)}</div></div>{[{title:"Product",links:["Features","Brand Voice","Avatar Studio","Pricing"]},{title:"Resources",links:["Documentation","Integrations","Guides","API"]},{title:"Company",links:["About","Careers","Contact","Security"]},{title:"Legal",links:["Privacy","Terms","DPA","Status"]}].map((column)=><div key={column.title}><p className="mb-5 text-sm font-semibold">{column.title}</p><ul className="space-y-3">{column.links.map(link=><li key={link}><a href="#top" className="text-sm text-muted-foreground transition hover:text-foreground">{link}</a></li>)}</ul></div>)}</div><div className="mt-20 flex flex-col justify-between gap-4 border-t border-border pt-7 text-xs text-muted-foreground md:flex-row"><p>© 2026 ShareOn, Inc. All systems operational.</p><p>Designed for ideas worth sharing.</p></div></div></footer>

      <div className="fixed bottom-5 right-5 z-50"><AnimatePresence>{assistantOpen && <motion.div className="glass-panel gradient-border absolute bottom-20 right-0 w-[min(22rem,calc(100vw-2.5rem))] rounded-[2rem] p-5" initial={{ opacity: 0, y: 16, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .92 }}><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cosmic"><Atom/></span><div><p className="font-semibold">ShareOn Intelligence</p><p className="text-xs text-cosmic">Online · ready to explore</p></div></div><Button variant="ghost" size="icon" onClick={()=>setAssistantOpen(false)} aria-label="Close assistant"><X/></Button></div><p className="mt-6 text-sm leading-relaxed text-muted-foreground">I can tour the platform, explain features, search docs, or help you book a tailored demo.</p><div className="mt-5 grid grid-cols-2 gap-2">{["Take a tour","Compare plans","Search docs","Book demo"].map(action=><button key={action} className="rounded-xl border border-border bg-surface-1 px-3 py-3 text-left text-xs transition hover:bg-accent">{action}</button>)}</div><div className="mt-4 flex gap-2 rounded-xl bg-surface-1 p-2"><input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" placeholder="Ask anything..."/><Button variant="hero" size="icon" aria-label="Send message"><Send/></Button></div></motion.div>}</AnimatePresence><button onClick={()=>setAssistantOpen(!assistantOpen)} aria-label="Open AI assistant" className="animate-orb-pulse relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary via-electric to-cosmic shadow-[var(--shadow-primary)]"><span className="absolute inset-1 rounded-full border border-foreground/20"/><Sparkles className="relative size-6"/></button></div>
    </main>
  );
}
