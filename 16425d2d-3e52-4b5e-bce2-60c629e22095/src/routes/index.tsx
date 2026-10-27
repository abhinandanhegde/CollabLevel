import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Handshake, Search, ShieldCheck, Star, UserRound, Scale, Eye, Lock } from "lucide-react";
import { PublicFooter, PublicNav } from "@/components/collab/public-nav";
import { Avatar, DemoTag, LevelBadge, VerificationBadge, btn } from "@/components/collab/primitives";
import { ACCOUNT_TYPES, LEVELS, accountLabel } from "@/lib/types";
import { getScore, profiles } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CollabLevel — Professional collaboration, built on credibility" },
      { name: "description", content: "Discover brands, creators, agencies and professionals, propose collaborations, and build credibility from real project history." },
      { property: "og:title", content: "CollabLevel — Professional collaboration, built on credibility" },
      { property: "og:description", content: "Find the right collaborators and earn credibility through genuine collaboration history." },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: UserRound, title: "Build a professional profile", text: "Show your work, skills and what you want to collaborate on — tailored to your account type." },
  { icon: Search, title: "Discover the right people", text: "Filter by account type, industry, expertise and credibility level." },
  { icon: Handshake, title: "Propose and manage projects", text: "Agree purpose, deliverables, timeline and compensation in one shared workspace." },
  { icon: Star, title: "Earn credibility", text: "Completed collaborations and eligible reviews raise your level over time." },
];

const principles = [
  { icon: ShieldCheck, title: "Earned, not bought", text: "Levels come from confirmed collaborations and reviews. They cannot be purchased." },
  { icon: Scale, title: "Verification is separate", text: "Identity verification is shown on its own, never blended into your level." },
  { icon: Eye, title: "Reviews need a real project", text: "Only participants of a completed collaboration can leave a review." },
  { icon: Lock, title: "Professional by design", text: "No feeds, no vanity metrics — just discovery, projects and trust." },
];

function Landing() {
  const preview = profiles.filter((p) => ["p1", "p2", "p6"].includes(p.id));
  return (
    <div className="min-h-screen">
      <PublicNav />

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div className="flex flex-col justify-center">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> For brands, creators and independent professionals
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Collaborate with people who've <em className="text-primary">proven</em> they deliver.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            CollabLevel connects professionals for real projects — and turns every completed collaboration into credibility you can show.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className={`${btn.primary} px-5 py-2.5`}>Create your profile <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/signin" className={`${btn.secondary} px-5 py-2.5`}>Sign in</Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile preview</span>
              <DemoTag />
            </div>
            <div className="mt-4 h-20 rounded-md bg-header" />
            <div className="-mt-8 px-4"><Avatar name="Maya Okafor" size="lg" /></div>
            <div className="mt-3 px-1">
              <p className="font-display text-xl font-semibold">Maya Okafor</p>
              <p className="text-sm text-muted-foreground">Creator or influencer · London</p>
              <div className="mt-3 flex flex-wrap gap-3"><LevelBadge score={71} /><VerificationBadge status="verified" /></div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
                {[["8", "Collaborations"], ["6", "Reviews"], ["71", "Score"]].map(([n, l]) => (
                  <div key={l}><p className="font-display text-2xl font-semibold">{n}</p><p className="text-xs text-muted-foreground">{l}</p></div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-lg border border-border bg-background p-4 shadow-sm md:block">
            <p className="text-xs text-muted-foreground">Collaboration completed</p>
            <p className="text-sm font-semibold">Both parties confirmed ✓</p>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-border bg-card/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-semibold">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-header text-header-foreground"><s.icon className="h-5 w-5" /></span>
                  <span className="font-display text-sm text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="who" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl font-semibold">One platform, eight kinds of professional</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">A shared profile foundation, with sections that fit how you actually work.</p>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ACCOUNT_TYPES.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-card px-4 py-5 text-sm font-medium">{t.label}</div>
          ))}
        </div>
      </section>

      <section className="bg-header py-20 text-header-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-center gap-3"><h2 className="text-3xl font-semibold">Credibility levels</h2></div>
          <p className="mt-2 max-w-xl text-header-foreground/75">Five levels, earned through completed collaborations, eligible reviews, and a complete profile.</p>
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {LEVELS.map((l) => (
              <div key={l.level} className="rounded-lg border border-header-foreground/15 p-4">
                <p className="text-xs text-header-foreground/60">Level {l.level}</p>
                <p className="mt-1 font-display text-lg">{l.name}</p>
                <p className="mt-2 text-xs text-header-foreground/60">From {l.min} pts</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center gap-2"><h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-header-foreground/70">Example profiles</h3><span className="rounded border border-dashed border-header-foreground/40 px-1.5 text-[10px] uppercase">Demo</span></div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {preview.map((p) => (
              <div key={p.id} className="rounded-lg bg-card p-5 text-card-foreground">
                <div className="flex items-center gap-3"><Avatar name={p.name} /><div><p className="font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">{accountLabel(p.accountType)}</p></div></div>
                <p className="mt-3 text-sm">{p.headline}</p>
                <div className="mt-3"><LevelBadge score={getScore(p.id).score} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl font-semibold">Trust principles</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="flex gap-4 rounded-lg border border-border bg-card p-5">
              <p.icon className="h-6 w-6 shrink-0 text-primary" />
              <div><h3 className="font-sans font-semibold">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.text}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-xl bg-primary px-8 py-10 text-primary-foreground md:flex md:items-center md:justify-between">
          <div><h2 className="text-2xl font-semibold">Start building credibility that lasts.</h2><p className="mt-1 opacity-85">Free to join. Set up your profile in minutes.</p></div>
          <Link to="/signup" className="mt-5 inline-flex rounded-md bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-background/90 md:mt-0">Create your profile</Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
