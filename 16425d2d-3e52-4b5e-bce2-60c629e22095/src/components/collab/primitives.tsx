import { Link } from "@tanstack/react-router";
import { BadgeCheck, Clock, ShieldOff } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { accountLabel, levelFor, type CollabStatus, type Profile, type VerificationStatus } from "@/lib/types";
import { getScore } from "@/lib/demo-data";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-display text-xl font-semibold", className)}>
      <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-sm text-primary-foreground">C</span>
      CollabLevel
    </span>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  const sz = { sm: "h-8 w-8 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-lg", xl: "h-24 w-24 text-2xl" }[size];
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full bg-header font-semibold text-header-foreground ring-2 ring-background", sz)}>
      {initials}
    </span>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-lg border border-border bg-card p-5", className)}>{children}</div>;
}

export function PanelHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {action}
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function LevelBadge({ score }: { score: number }) {
  const l = levelFor(score);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      Level {l.level} · {l.name}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const map = {
    verified: { icon: BadgeCheck, text: "Identity verified", cls: "text-success" },
    pending: { icon: Clock, text: "Verification pending", cls: "text-muted-foreground" },
    unverified: { icon: ShieldOff, text: "Not verified", cls: "text-muted-foreground" },
  }[status];
  const I = map.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", map.cls)}>
      <I className="h-3.5 w-3.5" /> {map.text}
    </span>
  );
}

const statusStyles: Record<CollabStatus | "connected" | "incoming-req" | "sent-req", string> = {
  incoming: "bg-accent/25 text-foreground",
  sent: "bg-background text-muted-foreground border border-border",
  active: "bg-primary/15 text-primary",
  completed: "bg-success/15 text-success",
  declined: "bg-destructive/10 text-destructive",
  connected: "bg-success/15 text-success",
  "incoming-req": "bg-accent/25 text-foreground",
  "sent-req": "bg-background text-muted-foreground border border-border",
};
const statusText: Record<keyof typeof statusStyles, string> = {
  incoming: "Awaiting your reply",
  sent: "Awaiting response",
  active: "Active",
  completed: "Completed",
  declined: "Declined",
  connected: "Connected",
  "incoming-req": "Wants to connect",
  "sent-req": "Request sent",
};

export function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}>
      {statusText[status]}
    </span>
  );
}

export function DemoTag() {
  return (
    <span className="rounded border border-dashed border-muted-foreground/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      Demo
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "accent" | "header" }) {
  const bg = { primary: "bg-primary", accent: "bg-accent", header: "bg-header" }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-background">
      <div className={cn("h-full rounded-full transition-all", bg)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function ProfileCard({ profile, action }: { profile: Profile; action?: ReactNode }) {
  const score = getScore(profile.id).score;
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar name={profile.name} />
        <div className="min-w-0 flex-1">
          <Link to="/app/profile/$id" params={{ id: profile.id }} className="font-semibold hover:text-primary">
            {profile.name}
          </Link>
          <p className="text-xs text-muted-foreground">
            {accountLabel(profile.accountType)} · {profile.location}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm">{profile.headline}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {profile.skills.slice(0, 3).map((s) => (
          <span key={s} className="rounded bg-background px-2 py-0.5 text-xs">{s}</span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <LevelBadge score={score} />
        <VerificationBadge status={profile.verification} />
      </div>
      <div className="mt-4 flex gap-2 border-t border-border pt-4">
        <Link
          to="/app/profile/$id"
          params={{ id: profile.id }}
          className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-center text-sm font-medium hover:bg-muted"
        >
          View profile
        </Link>
        {action}
      </div>
    </div>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50",
  ghost: "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
};
