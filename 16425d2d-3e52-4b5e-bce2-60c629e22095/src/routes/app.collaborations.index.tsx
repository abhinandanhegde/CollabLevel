import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, EmptyState, PageHeader, StatusBadge, btn } from "@/components/collab/primitives";
import { getProfile } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import type { CollabStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/collaborations/")({
  head: () => ({
    meta: [
      { title: "Collaborations — CollabLevel" },
      { name: "description", content: "Proposals, active projects and completed collaborations." },
      { property: "og:title", content: "Collaborations — CollabLevel" },
      { property: "og:description", content: "Proposals, active projects and completed collaborations." },
    ],
  }),
  component: Workspace,
});

const tabs: { id: CollabStatus; label: string }[] = [
  { id: "incoming", label: "Incoming proposals" },
  { id: "sent", label: "Sent proposals" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

function Workspace() {
  const { collaborations, setCollabStatus } = useStore();
  const [tab, setTab] = useState<CollabStatus>("incoming");
  const list = collaborations.filter((c) => c.status === tab);

  return (
    <>
      <PageHeader title="Collaborations" description="Every proposal and project in one workspace."
        action={<Link to="/app/collaborations/new" search={{ partner: undefined }} className={btn.primary}><Plus className="h-4 w-4" /> New proposal</Link>} />
      <div role="tablist" className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={cn("-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium", tab === t.id ? "border-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {t.label} <span className="ml-1 text-xs text-muted-foreground">{collaborations.filter((c) => c.status === t.id).length}</span>
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title="Nothing in this list" text="Proposals and projects move between these tabs as they progress." />
      ) : (
        <div className="space-y-3">
          {list.map((c) => {
            const p = getProfile(c.partnerId)!;
            return (
              <div key={c.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar name={p.name} />
                  <div className="min-w-0 flex-1">
                    <Link to="/app/collaborations/$id" params={{ id: c.id }} className="text-lg font-semibold hover:text-primary">{c.title}</Link>
                    <p className="text-sm text-muted-foreground">with {p.name} · {c.start} → {c.end}{c.compensation ? ` · ${c.compensation}` : ""}</p>
                    <p className="mt-2 line-clamp-2 text-sm">{c.purpose}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                  <Link to="/app/collaborations/$id" params={{ id: c.id }} className={btn.secondary}>View details</Link>
                  {c.status === "incoming" && (
                    <>
                      <button className={btn.secondary} onClick={() => { setCollabStatus(c.id, "declined"); toast("Proposal declined"); }}>Decline</button>
                      <button className={btn.primary} onClick={() => { setCollabStatus(c.id, "active"); toast.success("Proposal accepted — collaboration is now active"); }}>Accept</button>
                    </>
                  )}
                  {c.status === "sent" && <button className={btn.secondary} onClick={() => { setCollabStatus(c.id, "declined"); toast("Proposal withdrawn"); }}>Withdraw</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
