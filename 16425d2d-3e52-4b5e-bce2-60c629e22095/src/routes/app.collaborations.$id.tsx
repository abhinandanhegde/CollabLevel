import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { Avatar, EmptyState, Panel, PanelHeader, StatusBadge, btn } from "@/components/collab/primitives";
import { getProfile } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { accountLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/collaborations/$id")({
  head: () => ({
    meta: [
      { title: "Collaboration — CollabLevel" },
      { name: "description", content: "Participants, deliverables, timeline and milestones." },
      { property: "og:title", content: "Collaboration — CollabLevel" },
      { property: "og:description", content: "Participants, deliverables, timeline and milestones." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { collaborations, me, setCollabStatus, toggleMilestone, confirmCompletion } = useStore();
  const c = collaborations.find((x) => x.id === id);
  if (!c) return <EmptyState title="Collaboration not found" text="It may have been withdrawn." action={<Link to="/app/collaborations" className={btn.primary}>Back to workspace</Link>} />;
  const partner = getProfile(c.partnerId)!;
  const canEdit = c.status === "active";
  const allDone = c.milestones.every((m) => m.done);

  return (
    <>
      <Link to="/app/collaborations" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Collaborations</Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{c.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{c.start} → {c.end}</p>
        </div>
        <StatusBadge status={c.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Panel><PanelHeader title="Purpose" /><p className="text-sm leading-relaxed">{c.purpose}</p></Panel>
          <Panel>
            <PanelHeader title="Deliverables" />
            <ul className="space-y-2 text-sm">{c.deliverables.map((d) => <li key={d} className="flex gap-2"><span className="mt-2 h-1 w-1 rounded-full bg-primary" />{d}</li>)}</ul>
          </Panel>
          <Panel>
            <PanelHeader title="Milestones" />
            <ol className="space-y-1">
              {c.milestones.map((m, i) => (
                <li key={i}>
                  <button disabled={!canEdit} onClick={() => toggleMilestone(c.id, i)} className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-background disabled:cursor-default disabled:hover:bg-transparent">
                    <span className={cn("grid h-5 w-5 place-items-center rounded-full border", m.done ? "border-success bg-success text-primary-foreground" : "border-border bg-background")}>{m.done && <Check className="h-3 w-3" />}</span>
                    <span className={cn("flex-1 text-sm", m.done && "text-muted-foreground line-through")}>{m.title}</span>
                    <span className="text-xs text-muted-foreground">{m.due}</span>
                  </button>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <PanelHeader title="Participants" />
            {[me, partner].map((p) => (
              <Link key={p.id} to="/app/profile/$id" params={{ id: p.id }} className="flex items-center gap-3 rounded-md p-2 hover:bg-background">
                <Avatar name={p.name} size="sm" />
                <div><p className="text-sm font-medium">{p.name}{p.id === me.id && " (you)"}</p><p className="text-xs text-muted-foreground">{accountLabel(p.accountType)}</p></div>
              </Link>
            ))}
          </Panel>
          <Panel>
            <PanelHeader title="Compensation" />
            <p className="text-sm">{c.compensation ?? "Not specified"}</p>
            <p className="mt-2 text-xs text-muted-foreground">Agreed between participants. CollabLevel doesn't handle payments.</p>
          </Panel>
          <Panel>
            <PanelHeader title="Status" />
            {c.status === "incoming" && (
              <div className="flex gap-2">
                <button className={`${btn.secondary} flex-1`} onClick={() => { setCollabStatus(c.id, "declined"); toast("Proposal declined"); }}>Decline</button>
                <button className={`${btn.primary} flex-1`} onClick={() => { setCollabStatus(c.id, "active"); toast.success("Collaboration is now active"); }}>Accept</button>
              </div>
            )}
            {c.status === "sent" && <p className="text-sm text-muted-foreground">Waiting for {partner.name} to respond.</p>}
            {c.status === "declined" && <p className="text-sm text-muted-foreground">This proposal was declined or withdrawn.</p>}
            {c.status === "active" && (
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Completion needs confirmation from both participants before it counts towards credibility.</p>
                <ul className="space-y-1">
                  <li>You: {c.confirmedByMe ? "Confirmed ✓" : "Not confirmed"}</li>
                  <li>{partner.name}: {c.confirmedByPartner ? "Confirmed ✓" : "Not confirmed"}</li>
                </ul>
                <button disabled={!allDone || c.confirmedByMe} className={`${btn.primary} w-full`} onClick={() => { confirmCompletion(c.id); toast.success("Completion confirmed — waiting for your partner"); }}>
                  {c.confirmedByMe ? "You've confirmed" : "Confirm completion"}
                </button>
                {!allDone && <p className="text-xs text-muted-foreground">Finish all milestones to confirm.</p>}
              </div>
            )}
            {c.status === "completed" && <p className="text-sm">Both participants confirmed completion. <Link to="/app/credibility" className="text-primary hover:underline">See reviews</Link></p>}
          </Panel>
        </div>
      </div>
    </>
  );
}
