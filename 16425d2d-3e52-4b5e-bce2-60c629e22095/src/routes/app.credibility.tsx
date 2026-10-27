import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Avatar, DemoTag, PageHeader, Panel, PanelHeader, ProgressBar, StatusBadge, VerificationBadge } from "@/components/collab/primitives";
import { getProfile, getScore, reviews } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { LEVELS, levelFor } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/credibility")({
  head: () => ({
    meta: [
      { title: "Reviews & credibility — CollabLevel" },
      { name: "description", content: "How your credibility score and level are calculated." },
      { property: "og:title", content: "Reviews & credibility — CollabLevel" },
      { property: "og:description", content: "How your credibility score and level are calculated." },
    ],
  }),
  component: Credibility,
});

function Credibility() {
  const { me, collaborations } = useStore();
  const s = getScore(me.id);
  const lvl = levelFor(s.score);
  const completed = collaborations.filter((c) => c.status === "completed");

  return (
    <>
      <PageHeader title="Reviews & credibility" description="Your level reflects confirmed collaborations and eligible reviews." />
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Score breakdown" action={<span className="text-xs text-muted-foreground">Preview calculation</span>} />
          <div className="mb-6 flex items-baseline gap-3"><p className="font-display text-5xl">{s.score}</p><p className="text-muted-foreground">/ 100 · Level {lvl.level} {lvl.name}</p></div>
          <div className="space-y-4">
            {s.breakdown.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-sm"><span>{b.label}</span><span className="text-muted-foreground">{b.value} / {b.max}</span></div>
                <ProgressBar value={(b.value / b.max) * 100} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Verification" />
          <VerificationBadge status={me.verification} />
          <p className="mt-3 text-sm text-muted-foreground">Verification confirms identity only. It is tracked separately and never adds points to your level.</p>
        </Panel>
      </div>

      <Panel className="mt-5">
        <PanelHeader title="Levels" />
        <div className="grid gap-3 md:grid-cols-5">
          {LEVELS.map((l) => (
            <div key={l.level} className={cn("rounded-md border p-4", l.level === lvl.level ? "border-primary bg-primary/10" : "border-border bg-background")}>
              <p className="text-xs text-muted-foreground">Level {l.level}</p>
              <p className="font-display text-lg">{l.name}</p>
              <p className="text-xs text-muted-foreground">From {l.min} points</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Collaboration history" />
          {completed.length === 0 ? <p className="text-sm text-muted-foreground">Completed collaborations will appear here.</p> : (
            <ul className="divide-y divide-border">
              {completed.map((c) => <li key={c.id} className="flex items-center justify-between py-3 text-sm"><span>{c.title} · {getProfile(c.partnerId)?.name}</span><StatusBadge status="completed" /></li>)}
            </ul>
          )}
        </Panel>
        <Panel>
          <PanelHeader title="Eligible reviews" action={<DemoTag />} />
          <p className="mb-4 text-xs text-muted-foreground">Only participants of a completed, mutually confirmed collaboration can leave a review.</p>
          {reviews.map((r) => {
            const a = getProfile(r.authorId)!;
            return (
              <div key={r.id} className="rounded-md bg-background p-4">
                <div className="flex items-center gap-3"><Avatar name={a.name} size="sm" /><div className="flex-1"><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{r.date}</p></div>
                  <span className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-accent text-accent" : "text-border")} />)}</span></div>
                <p className="mt-3 text-sm">"{r.text}"</p>
              </div>
            );
          })}
        </Panel>
      </div>
    </>
  );
}
