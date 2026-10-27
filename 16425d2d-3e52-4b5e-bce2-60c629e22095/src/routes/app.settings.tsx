import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Field, inputCls, toErrors, type FormErrors } from "@/components/collab/auth-layout";
import { PageHeader, Panel, PanelHeader, btn } from "@/components/collab/primitives";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";
import { ACCOUNT_TYPES, type AccountType } from "@/lib/types";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CollabLevel" },
      { name: "description", content: "Edit your profile and account preferences." },
      { property: "og:title", content: "Settings — CollabLevel" },
      { property: "og:description", content: "Edit your profile and account preferences." },
    ],
  }),
  component: Settings,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  headline: z.string().trim().min(5, "Add a headline").max(120),
  bio: z.string().trim().max(1000),
  location: z.string().trim().min(2, "Location is required"),
  industry: z.string().trim().min(2, "Industry is required"),
  skills: z.string(),
  interests: z.string(),
  accountType: z.string(),
});

function Settings() {
  const { me, updateMe } = useStore();
  const [errors, setErrors] = useState<FormErrors>({});
  const [prefs, setPrefs] = useState({ proposals: true, connections: true, digest: false });
  const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <PageHeader title="Settings" description="Changes apply for this session until accounts are connected." />
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Profile" />
          <form noValidate className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
            if (!r.success) return setErrors(toErrors(r.error.issues));
            setErrors({});
            updateMe({ ...r.data, accountType: r.data.accountType as AccountType, skills: split(r.data.skills), interests: split(r.data.interests) });
            toast.success("Profile updated");
          }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}><input name="name" defaultValue={me.name} className={inputCls} aria-invalid={!!errors.name} /></Field>
              <Field label="Account type">
                <select name="accountType" defaultValue={me.accountType} className={inputCls}>{ACCOUNT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select>
              </Field>
            </div>
            <Field label="Headline" error={errors.headline}><input name="headline" defaultValue={me.headline} className={inputCls} aria-invalid={!!errors.headline} /></Field>
            <Field label="Bio"><textarea name="bio" rows={4} defaultValue={me.bio} className={inputCls} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location" error={errors.location}><input name="location" defaultValue={me.location} className={inputCls} aria-invalid={!!errors.location} /></Field>
              <Field label="Industry" error={errors.industry}><input name="industry" defaultValue={me.industry} className={inputCls} aria-invalid={!!errors.industry} /></Field>
            </div>
            <Field label="Skills (comma separated)"><input name="skills" defaultValue={me.skills.join(", ")} className={inputCls} /></Field>
            <Field label="Collaboration interests (comma separated)"><input name="interests" defaultValue={me.interests.join(", ")} className={inputCls} /></Field>
            <div className="flex justify-end"><button className={btn.primary}>Save profile</button></div>
          </form>
        </Panel>
        <div className="space-y-5">
          <Panel>
            <PanelHeader title="Email notifications" />
            {([["proposals", "New proposals"], ["connections", "Connection requests"], ["digest", "Weekly digest"]] as const).map(([k, l]) => (
              <label key={k} className="flex items-center justify-between py-2 text-sm">{l}<Switch checked={prefs[k]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [k]: v }))} /></label>
            ))}
            <p className="mt-2 text-xs text-muted-foreground">Emails aren't sent yet in preview mode.</p>
          </Panel>
          <Panel>
            <PanelHeader title="Account" />
            <p className="text-sm text-muted-foreground">Password, email and account deletion will be available once sign-in is connected.</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
