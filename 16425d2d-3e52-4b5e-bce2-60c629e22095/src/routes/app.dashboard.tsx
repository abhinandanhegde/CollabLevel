import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Avatar, EmptyState, PageHeader, Panel, PanelHeader, ProfileCard, ProgressBar, StatusBadge, btn } from "@/components/collab/primitives";
import { ConnectButton } from "@/components/collab/connect-button";
import { getProfile, getScore, profileCompletion, profiles } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { levelFor, nextLevel } from "@/lib/types";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CollabLevel" },
      { name: "description", content: "Your credibility, connections and collaborations at a glance." },
      { property: "og:title", content: "Dashboard — CollabLevel" },
      { property: "og:description", content: "Your credibility, connections and collaborations at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { me, connections, collaborations, notifications, respondConnection } = useStore();
  const score = getScore(me.id).score;
  const lvl = levelFor(score);
  const next = nextLevel(score);
  const completion = profileCompletion(me);
  const incoming = connections.filter((c) => c.status === "incoming");
  const active = collaborations.filter((c) => c.status === "active");
  const connectedIds = new Set(connections.map((c) => c.profileId));
  const suggested = profiles.filter((p) => p.id !== me.id && !connectedIds.has(p.id)).slice(0, 3);
  const counts = {
    incoming: collaborations.filter((c) => c.status === "incoming").length,
    sent: collaborations.filter((c) => c.status === "sent").length,
    active: active.length,
    completed: collaborations.filter((c) => c.status === "completed").length,
  };

  return (
    <>
      <PageHeader title={`Good to see you, ${me.name.split(" ")[0]}`} description="Here's what needs your attention." />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg bg-header p-6 text-header-foreground lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-header-foreground/60">Credibility</p>
              <p className="mt-2 font-display text-5xl">{score}<span className="text-xl text-header-foreground/50"> / 100</span></p>
              <p className="mt-1 text-sm">Level {lvl.level} · {lvl.name}</p>
            </div>
            <div className="min-w-56 flex-1 md:max-w-xs">
              {next ? (
                <>
                  <div className="mb-2 flex justify-between text-xs text-header-foreground/70"><span>{lvl.name}</span><span>{next.name} at {next.min}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-header-foreground/15"><div className="h-full rounded-full bg-accent" style={{ width: `${((score - lvl.min) / (next.min - lvl.min)) * 100}%` }} /></div>
                  <p className="mt-2 text-xs text-header-foreground/70">{next.min - score} points to the next level</p>
                </>
              ) : <p className="text-sm">Highest level reached.</p>}
              <Link to="/app/credibility" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">See breakdown <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </div>

        <Panel>
          <PanelHeader title="Profile completion" />
          <p className="font-display text-3xl">{completion}%</p>
          <div className="mt-3"><ProgressBar value={completion} /></div>
          <p className="mt-3 text-sm text-muted-foreground">A complete profile helps others decide to collaborate with you.</p>
          <Link to="/app/settings" className={`${btn.secondary} mt-4 w-full`}>Improve profile</Link>
        </Panel>

        <Panel>
          <PanelHeader title="Collaboration proposals" action={<Link to="/app/collaborations" className="text-xs font-medium text-primary hover:underline">Open workspace</Link>} />
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(counts).map(([k, v]) => (
              <div key={k} className="rounded-md bg-background p-3"><p className="font-display text-2xl">{v}</p><p className="text-xs capitalize text-muted-foreground">{k}</p></div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Pending connection requests" />
          {incoming.length === 0 ? <p className="text-sm text-muted-foreground">You're all caught up.</p> : (
            <ul className="space-y-3">
              {incoming.map((c) => {
                const p = getProfile(c.profileId)!;
                return (
                  <li key={c.id} className="flex items-center gap-3">
                    <Avatar name={p.name} size="sm" />
                    <Link to="/app/profile/$id" params={{ id: p.id }} className="min-w-0 flex-1 truncate text-sm font-medium hover:text-primary">{p.name}</Link>
                    <button className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10" onClick={() => { respondConnection(c.id, true); toast.success(`Connected with ${p.name}`); }}>Accept</button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Recent notifications" action={<Link to="/app/notifications" className="text-xs font-medium text-primary hover:underline">View all</Link>} />
          <ul className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id} className="flex gap-2 text-sm">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? "bg-border" : "bg-primary"}`} />
                <span className={n.read ? "text-muted-foreground" : ""}>{n.text}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="lg:col-span-3">
          <PanelHeader title="Active collaborations" />
          {active.length === 0 ? (
            <EmptyState title="No active collaborations" text="Accepted proposals will appear here." action={<Link to="/app/discover" className={btn.primary}>Find collaborators</Link>} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {active.map((c) => {
                const done = c.milestones.filter((m) => m.done).length;
                return (
                  <Link key={c.id} to="/app/collaborations/$id" params={{ id: c.id }} className="rounded-md border border-border bg-background p-4 hover:border-primary/50">
                    <div className="flex items-center justify-between gap-2"><p className="font-semibold">{c.title}</p><StatusBadge status={c.status} /></div>
                    <p className="mt-1 text-xs text-muted-foreground">with {getProfile(c.partnerId)?.name} · ends {c.end}</p>
                    <div className="mt-3"><ProgressBar value={(done / c.milestones.length) * 100} tone="header" /></div>
                    <p className="mt-1 text-xs text-muted-foreground">{done} of {c.milestones.length} milestones</p>
                  </Link>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold">Suggested collaborators</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {suggested.map((p) => <ProfileCard key={p.id} profile={p} action={<ConnectButton profileId={p.id} />} />)}
      </div>
    </>
  );
}
