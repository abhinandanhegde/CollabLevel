import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Handshake, Star, Users, Flag } from "lucide-react";
import { EmptyState, PageHeader, btn } from "@/components/collab/primitives";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — CollabLevel" },
      { name: "description", content: "Requests, proposals, milestones and reviews." },
      { property: "og:title", content: "Notifications — CollabLevel" },
      { property: "og:description", content: "Requests, proposals, milestones and reviews." },
    ],
  }),
  component: Notifications,
});

const icons = { connection: Users, proposal: Handshake, milestone: Flag, review: Star, system: Bell };

function Notifications() {
  const { notifications, markAllRead } = useStore();
  const unread = notifications.some((n) => !n.read);
  return (
    <>
      <PageHeader title="Notifications" action={unread && <button onClick={markAllRead} className={btn.secondary}>Mark all as read</button>} />
      {notifications.length === 0 ? <EmptyState title="No notifications" text="We'll let you know when something needs your attention." /> : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {notifications.map((n) => {
            const I = icons[n.kind];
            const body = (
              <div className="flex items-start gap-4 p-4">
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", n.read ? "bg-background text-muted-foreground" : "bg-primary/15 text-primary")}><I className="h-4 w-4" /></span>
                <div className="flex-1"><p className={cn("text-sm", !n.read && "font-medium")}>{n.text}</p><p className="text-xs text-muted-foreground">{n.date}</p></div>
                {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
              </div>
            );
            return <li key={n.id}>{n.href ? <Link to={n.href} className="block hover:bg-background/60">{body}</Link> : body}</li>;
          })}
        </ul>
      )}
    </>
  );
}
