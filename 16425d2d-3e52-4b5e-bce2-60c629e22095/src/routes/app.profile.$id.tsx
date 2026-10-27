import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, MapPin } from "lucide-react";
import { Avatar, DemoTag, EmptyState, LevelBadge, Panel, PanelHeader, StatusBadge, VerificationBadge, btn } from "@/components/collab/primitives";
import { ConnectButton } from "@/components/collab/connect-button";
import { getProfile, getScore } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { accountLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/profile/$id")({
  head: () => ({
    meta: [
      { title: "Profile — CollabLevel" },
      { name: "description", content: "Professional profile, portfolio and collaboration history." },
      { property: "og:title", content: "Profile — CollabLevel" },
      { property: "og:description", content: "Professional profile, portfolio and collaboration history." },
    ],
  }),
  component: ProfilePage,
});

const tone = { terracotta: "bg-primary", olive: "bg-header", mustard: "bg-accent", sand: "bg-muted-foreground/40" };

function ProfilePage() {
  const { id } = Route.useParams();
  const { me, collaborations } = useStore();
  const profile = id === me.id ? me : getProfile(id);
  if (!profile) return <EmptyState title="Profile not found" text="This profile may have been removed." action={<Link to="/app/discover" className={btn.primary}>Back to Discover</Link>} />;
  const isMe = profile.id === me.id;
  const score = getScore(profile.id).score;
  const history = isMe ? collaborations.filter((c) => c.status === "completed" || c.status === "active") : collaborations.filter((c) => c.partnerId === profile.id && (c.status === "completed" || c.status === "active"));

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="relative h-36 bg-header md:h-44">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, var(--accent) 0, transparent 40%), radial-gradient(circle at 20% 90%, var(--primary) 0, transparent 45%)" }} />
          {!isMe && <span className="absolute right-4 top-4 rounded bg-background/90 px-1"><DemoTag /></span>}
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <Avatar name={profile.name} size="xl" />
            <div className="flex gap-2">
              {isMe ? <Link to="/app/settings" className={btn.secondary}>Edit profile</Link> : (
                <>
                  <ConnectButton profileId={profile.id} className="flex-none px-4" />
                  <Link to="/app/collaborations/new" search={{ partner: profile.id }} className={btn.secondary}>Propose</Link>
                </>
              )}
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-semibold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{accountLabel(profile.accountType)} · @{profile.handle}</p>
          <p className="mt-3 max-w-2xl">{profile.headline}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{profile.location}</span>
            <span className="text-muted-foreground">{profile.industry}</span>
            <LevelBadge score={score} />
            <VerificationBadge status={profile.verification} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panel><PanelHeader title="About" /><p className="text-sm leading-relaxed">{profile.bio}</p></Panel>
          <Panel>
            <PanelHeader title="Portfolio" />
            {profile.portfolio.length === 0 ? <p className="text-sm text-muted-foreground">No portfolio items yet.</p> : (
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.portfolio.map((w) => (
                  <div key={w.title} className="overflow-hidden rounded-md border border-border bg-background">
                    <div className={cn("h-28", tone[w.tone])} />
                    <div className="p-3"><p className="text-sm font-semibold">{w.title}</p><p className="text-xs text-muted-foreground">{w.description}</p></div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
          <Panel>
            <PanelHeader title="Collaboration history" />
            {history.length === 0 ? <p className="text-sm text-muted-foreground">No collaborations on CollabLevel yet.</p> : (
              <ul className="divide-y divide-border">
                {history.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                    <div><p className="text-sm font-medium">{c.title}</p><p className="text-xs text-muted-foreground">{c.start} → {c.end}</p></div>
                    <StatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel>
            <PanelHeader title="Credibility" />
            <p className="font-display text-4xl">{score}</p>
            <div className="mt-2"><LevelBadge score={score} /></div>
            <p className="mt-3 text-xs text-muted-foreground">Verification is shown separately and does not affect level.</p>
          </Panel>
          <Panel>
            <PanelHeader title={`${accountLabel(profile.accountType, true)} details`} />
            <dl className="space-y-2 text-sm">
              {profile.typeFields.map((f) => <div key={f.label} className="flex justify-between gap-3"><dt className="text-muted-foreground">{f.label}</dt><dd className="text-right font-medium">{f.value}</dd></div>)}
            </dl>
          </Panel>
          <Panel>
            <PanelHeader title="Skills" />
            <div className="flex flex-wrap gap-1.5">{profile.skills.map((s) => <span key={s} className="rounded bg-background px-2 py-1 text-xs">{s}</span>)}</div>
            <h3 className="mb-2 mt-5 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">Open to</h3>
            <div className="flex flex-wrap gap-1.5">{profile.interests.map((s) => <span key={s} className="rounded border border-border px-2 py-1 text-xs">{s}</span>)}</div>
          </Panel>
          <Panel>
            <PanelHeader title="Links" />
            <ul className="space-y-2">{profile.links.map((l) => <li key={l.label}><a href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">{l.label}<ExternalLink className="h-3 w-3" /></a></li>)}</ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
