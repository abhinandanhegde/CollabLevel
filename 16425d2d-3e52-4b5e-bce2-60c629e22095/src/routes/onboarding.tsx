import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthLayout, Field, inputCls, toErrors, type FormErrors } from "@/components/collab/auth-layout";
import { btn } from "@/components/collab/primitives";
import { ACCOUNT_TYPES, accountLabel, type AccountType } from "@/lib/types";
import { useStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

const search = z.object({ type: z.enum(ACCOUNT_TYPES.map((t) => t.id) as [AccountType, ...AccountType[]]).catch("independent") });

export const Route = createFileRoute("/onboarding")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Set up your profile — CollabLevel" },
      { name: "description", content: "Complete your CollabLevel professional profile." },
      { property: "og:title", content: "Set up your profile — CollabLevel" },
      { property: "og:description", content: "Complete your CollabLevel professional profile." },
    ],
  }),
  component: Onboarding,
});

const typeQuestion: Record<AccountType, string> = {
  brand: "Company size",
  startup: "Funding stage",
  creator: "Audience size",
  artist: "Disciplines",
  agency: "Team size",
  marketer: "Main channels",
  independent: "Availability",
  community: "Number of members",
};

const step1 = z.object({
  headline: z.string().trim().min(5, "Add a short headline").max(120),
  location: z.string().trim().min(2, "Add your location"),
  industry: z.string().trim().min(2, "Add your industry"),
});

function Onboarding() {
  const { type } = Route.useSearch();
  const nav = useNavigate();
  const { updateMe } = useStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [data, setData] = useState<FormErrors>({});

  return (
    <AuthLayout title="Set up your profile" subtitle={`Step ${step} of 2 · ${accountLabel(type)}`}>
      <div className="mb-6 flex gap-2">{[1, 2].map((s) => <span key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-border"}`} />)}</div>
      {step === 1 ? (
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
            const r = step1.safeParse(v);
            if (!r.success) return setErrors(toErrors(r.error.issues));
            setErrors({}); setData(r.data); setStep(2);
          }}
        >
          <Field label="Headline" error={errors.headline}><input name="headline" placeholder="What you do, in one line" className={inputCls} aria-invalid={!!errors.headline} /></Field>
          <Field label="Location" error={errors.location}><input name="location" className={inputCls} aria-invalid={!!errors.location} /></Field>
          <Field label="Industry" error={errors.industry}><input name="industry" className={inputCls} aria-invalid={!!errors.industry} /></Field>
          <button className={`${btn.primary} w-full py-2.5`}>Next</button>
        </form>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
            const skills = v["skills"] ? v["skills"].split(",").map((s) => s.trim()).filter(Boolean) : [];
            const typeFields = v["typeField"] ? [{ label: typeQuestion[type], value: v["typeField"] ?? "" }] : [];
            const { data: auth } = await supabase.auth.getUser();
            if (!auth.user) {
              toast.error("Please sign in to save your profile");
              return nav({ to: "/signin", search: { redirect: "/app/dashboard" } });
            }
            const { error } = await supabase.from("profiles").update({
              headline: data.headline ?? "",
              location: data.location ?? "",
              industry: data.industry ?? "",
              skills,
              type_fields: typeFields,
            }).eq("id", auth.user.id);
            if (error) return toast.error("Couldn't save your profile. Please try again.");
            updateMe({
              accountType: type,
              headline: data.headline ?? "",
              location: data.location ?? "",
              industry: data.industry ?? "",
              skills: v["skills"] ? v["skills"].split(",").map((s) => s.trim()).filter(Boolean) : [],
              typeFields: v["typeField"] ? [{ label: typeQuestion[type], value: v["typeField"] ?? "" }] : [],
            });
            toast.success("Profile saved");
            nav({ to: "/app/dashboard" });
          }}
        >
          <Field label="Skills (comma separated)"><input name="skills" placeholder="e.g. Photography, Strategy" className={inputCls} /></Field>
          <Field label={typeQuestion[type]}><input name="typeField" className={inputCls} /></Field>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className={`${btn.secondary} flex-1`}>Back</button>
            <button className={`${btn.primary} flex-1`}>Finish</button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
