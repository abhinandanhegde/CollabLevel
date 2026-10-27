import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "./primitives";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-header p-10 text-header-foreground md:flex">
        <Link to="/"><Logo /></Link>
        <blockquote className="max-w-sm">
          <p className="font-display text-2xl leading-snug">"Credibility is the sum of the work you've finished with others."</p>
        </blockquote>
        <p className="text-xs text-header-foreground/60">Levels are earned, never bought.</p>
      </aside>
      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 block md:hidden"><Logo /></Link>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string | undefined; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-destructive";

const FIELD_KEYS = ["name","email","password","type","headline","location","industry","partnerId","title","purpose","deliverables","start","end","compensation","bio","skills","interests","accountType"] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];
export type FormErrors = Partial<Record<FieldKey, string>>;
export function toErrors(issues: { path: (string | number)[]; message: string }[]): FormErrors {
  const out: FormErrors = {};
  for (const i of issues) { const k = String(i.path[0]) as FieldKey; if (!out[k]) out[k] = i.message; }
  return out;
}
