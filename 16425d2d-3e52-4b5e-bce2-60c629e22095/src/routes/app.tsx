import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Compass, Handshake, LayoutDashboard, LogOut, Menu, Settings, Star, UserRound, Users, X } from "lucide-react";
import { useState } from "react";
import { Avatar, Logo } from "@/components/collab/primitives";
import { useStore } from "@/lib/store";
import { accountLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app")({
  // Session lives in browser storage, so the gate runs client-side only.
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/signin", search: { redirect: location.href } });
    return { user: data.user };
  },
  component: AppShell,
});

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/discover", label: "Discover", icon: Compass },
  { to: "/app/connections", label: "Connections", icon: Users },
  { to: "/app/collaborations", label: "Collaborations", icon: Handshake },
  { to: "/app/credibility", label: "Credibility", icon: Star },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { notifications, connections, collaborations, me } = useStore();
  const counts: Record<string, number> = {
    "/app/notifications": notifications.filter((n) => !n.read).length,
    "/app/connections": connections.filter((c) => c.status === "incoming").length,
    "/app/collaborations": collaborations.filter((c) => c.status === "incoming").length,
  };
  const linkCls =
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground";
  const active = { className: "!bg-sidebar-primary !text-sidebar-primary-foreground font-medium" };
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {nav.map((n) => (
        <Link key={n.to} to={n.to} onClick={onNavigate} className={linkCls} activeProps={active}>
          <n.icon className="h-4 w-4" />
          <span className="flex-1">{n.label}</span>
          {(counts[n.to] ?? 0) > 0 && <span className="rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-foreground">{counts[n.to]}</span>}
        </Link>
      ))}
      <div className="my-3 border-t border-sidebar-border" />
      <Link to="/app/profile/$id" params={{ id: me.id }} onClick={onNavigate} className={linkCls} activeProps={active}>
        <UserRound className="h-4 w-4" /> My profile
      </Link>
      <Link to="/app/settings" onClick={onNavigate} className={linkCls} activeProps={active}>
        <Settings className="h-4 w-4" /> Settings
      </Link>
    </nav>
  );
}

function UserFooter() {
  const { me } = useStore();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["my-profile", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("name, account_type").eq("id", user.id).maybeSingle();
      return data;
    },
  });
  const name = profile?.name ?? me.name;
  const type = profile?.account_type ?? me.accountType;
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/signin", replace: true });
  }
  return (
    <div className="flex items-center gap-3 border-t border-sidebar-border pt-4">
      <Avatar name={name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-sidebar-foreground/60">{accountLabel(type)}</p>
      </div>
      <button type="button" onClick={signOut} aria-label="Sign out" title="Sign out" className="rounded p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

function AppShell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col gap-6 bg-sidebar p-5 text-sidebar-foreground md:sticky md:top-0 md:flex md:h-screen">
        <Link to="/app/dashboard"><Logo /></Link>
        <NavLinks />
        <UserFooter />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-header px-4 text-header-foreground md:hidden">
        <Link to="/app/dashboard"><Logo className="text-lg" /></Link>
        <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded p-2 hover:bg-header-foreground/10"><Menu className="h-5 w-5" /></button>
      </header>
      <div className={cn("fixed inset-0 z-40 md:hidden", open ? "" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-foreground/40 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <aside className={cn("absolute inset-y-0 left-0 flex w-72 flex-col gap-6 bg-sidebar p-5 text-sidebar-foreground transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center justify-between"><Logo /><button aria-label="Close menu" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
          <NavLinks onNavigate={() => setOpen(false)} />
          <UserFooter />
        </aside>
      </div>

      <main className="min-w-0 flex-1">
        <div className="border-b border-dashed border-border bg-card/50 px-5 py-2 text-xs text-muted-foreground">
          You're signed in with a real account. Other profiles, connections, collaborations and reviews shown here are still fictional demonstration data and reset on refresh.
        </div>
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
