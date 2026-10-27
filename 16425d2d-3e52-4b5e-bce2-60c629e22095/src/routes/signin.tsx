import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthLayout, Field, inputCls, toErrors, type FormErrors } from "@/components/collab/auth-layout";
import { btn } from "@/components/collab/primitives";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError, safeRedirect } from "@/lib/auth";

export const Route = createFileRoute("/signin")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sign in — CollabLevel" },
      { name: "description", content: "Sign in to your CollabLevel account." },
      { property: "og:title", content: "Sign in — CollabLevel" },
      { property: "og:description", content: "Sign in to your CollabLevel account." },
    ],
  }),
  component: SignIn,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

function SignIn() {
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your collaborations.">
      <form
        noValidate
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setFormError(null);
          const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
          if (!r.success) return setErrors(toErrors(r.error.issues));
          setErrors({});
          setBusy(true);
          const { error } = await supabase.auth.signInWithPassword(r.data);
          setBusy(false);
          if (error) return setFormError(friendlyAuthError(error));
          nav({ to: safeRedirect(redirect), replace: true });
        }}
      >
        {formError && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>}
        <Field label="Email" error={errors.email}><input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={inputCls} /></Field>
        <Field label="Password" error={errors.password}><input name="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} className={inputCls} /></Field>
        <button disabled={busy} className={`${btn.primary} w-full py-2.5 disabled:opacity-60`}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link></p>
    </AuthLayout>
  );
}
