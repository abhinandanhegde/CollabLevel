import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, EmptyState, PageHeader, StatusBadge, btn } from "@/components/collab/primitives";
import { getProfile } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { accountLabel, type ConnectionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/connections")({
  head: () => ({
    meta: [
      { title: "Connections — CollabLevel" },
      { name: "description", content: "Manage your professional connections and requests." },
      { property: "og:title", content: "Connections — CollabLevel" },
      { property: "og:description", content: "Manage your professional connections and requests." },
    ],
  }),
  component: Connections,
});

const tabs: { id: ConnectionStatus; label: string }[] = [
  { id: "connected", label: "Connections" },
  { id: "incoming", label: "Incoming" },
  { id: "sent", label: "Sent" },
];

function Connections() {
  const { connections, respondConnection, withdrawConnection } = useStore();
  const [tab, setTab] = useState<ConnectionStatus>("connected");
  const list = connections.filter((c) => c.status === tab);

  return (
    <>
      <PageHeader title="Connections" description="People you can propose collaborations to." />
      <div role="tablist" className="mb-5 flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={cn("-mb-px border-b-2 px-4 py-2 text-sm font-medium", tab === t.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {t.label} <span className="ml-1 text-xs text-muted-foreground">{connections.filter((c) => c.status === t.id).length}</span>
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title="Nothing here yet" text={tab === "connected" ? "Connect with people from Discover." : "No requests right now."} action={<Link to="/app/discover" className={btn.primary}>Discover people</Link>} />
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {list.map((c) => {
            const p = getProfile(c.profileId)!;
            return (
              <li key={c.id} className="flex flex-wrap items-center gap-4 p-4">
                <Avatar name={p.name} />
                <div className="min-w-0 flex-1">
                  <Link to="/app/profile/$id" params={{ id: p.id }} className="font-semibold hover:text-primary">{p.name}</Link>
                  <p className="text-xs text-muted-foreground">{accountLabel(p.accountType)} · {c.date}</p>
                  {c.note && <p className="mt-1 text-sm italic text-muted-foreground">"{c.note}"</p>}
                </div>
                <StatusBadge status={c.status === "connected" ? "connected" : c.status === "incoming" ? "incoming-req" : "sent-req"} />
                <div className="flex gap-2">
                  {c.status === "incoming" && (
                    <>
                      <button className={btn.secondary} onClick={() => { respondConnection(c.id, false); toast("Request declined"); }}>Decline</button>
                      <button className={btn.primary} onClick={() => { respondConnection(c.id, true); toast.success(`Connected with ${p.name}`); }}>Accept</button>
                    </>
                  )}
                  {c.status === "sent" && <button className={btn.secondary} onClick={() => { withdrawConnection(c.id); toast("Request withdrawn"); }}>Withdraw</button>}
                  {c.status === "connected" && <Link to="/app/collaborations/new" search={{ partner: p.id }} className={btn.secondary}>Propose collaboration</Link>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
