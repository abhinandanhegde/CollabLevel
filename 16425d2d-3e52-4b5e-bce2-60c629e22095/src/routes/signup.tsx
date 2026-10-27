import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/auth";
import { useState } from "react";
import { z } from "zod";
import { AuthLayout, Field, inputCls, toErrors, type FormErrors } from "@/components/collab/auth-layout";
import { btn } from "@/components/collab/primitives";
import { ACCOUNT_TYPES, type AccountType } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account — CollabLevel" },
      { name: "description", content: "Join CollabLevel and start building professional credibility." },
      { property: "og:title", content: "Create an account — CollabLevel" },
      { property: "og:description", content: "Join CollabLevel and start building professional credibility." },
    ],
  }),
  component: SignUp,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name or organisation name").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

function SignUp() {
  const nav = useNavigate();
  const [type, setType] = useState<AccountType | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <AuthLayout title="Check your email" subtitle="One more step to activate your account.">
        <p className="text-sm text-muted-foreground">We sent a confirmation link to <span className="font-medium text-foreground">{sentTo}</span>. Open it, then sign in to finish setting up your profile.</p>
        <Link to="/signin" className={`${btn.primary} mt-6 block w-full py-2.5 text-center`}>Go to sign in</Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Choose the account type that best describes you.">
      <form
        noValidate
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setFormError(null);
          const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
          const errs: FormErrors = r.success ? {} : toErrors(r.error.issues);
          if (!type) errs.type = "Choose an account type";
          setErrors(errs);
          if (!r.success || !type || Object.keys(errs).length > 0) return;
          setBusy(true);
          const { data, error } = await supabase.auth.signUp({
            email: r.data.email,
            password: r.data.password,
            options: {
              emailRedirectTo: `${window.location.origin}/signin`,
              data: { name: r.data.name, account_type: type },
            },
          });
          setBusy(false);
          if (error) return setFormError(friendlyAuthError(error));
          // Supabase returns a user with no identities when the email is already registered.
          if (data.user && data.user.identities?.length === 0) return setFormError("An account with this email already exists. Try signing in.");
          if (data.session) nav({ to: "/onboarding", search: { type } });
          else setSentTo(r.data.email);
        }}
      >
        {formError && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>}
        <div>
          <span className="mb-2 block text-sm font-medium">Account type</span>
          <div className="grid grid-cols-2 gap-2">
            {ACCOUNT_TYPES.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setType(t.id)}
                aria-pressed={type === t.id}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-left text-sm transition",
                  type === t.id ? "border-primary bg-primary/10 font-medium" : "border-border bg-card hover:border-primary/50",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {errors.type && <span className="mt-1 block text-xs text-destructive">{errors.type}</span>}
        </div>
        <Field label="Name" error={errors.name}><input name="name" aria-invalid={!!errors.name} className={inputCls} /></Field>
        <Field label="Email" error={errors.email}><input name="email" type="email" aria-invalid={!!errors.email} className={inputCls} /></Field>
        <Field label="Password" error={errors.password}><input name="password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} className={inputCls} /></Field>
        <button disabled={busy} className={`${btn.primary} w-full py-2.5 disabled:opacity-60`}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link to="/signin" className="font-medium text-primary hover:underline">Sign in</Link></p>
    </AuthLayout>
  );
}
