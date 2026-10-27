import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Field, inputCls, toErrors, type FormErrors } from "@/components/collab/auth-layout";
import { EmptyState, PageHeader, Panel, btn } from "@/components/collab/primitives";
import { getProfile } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/app/collaborations/new")({
  validateSearch: z.object({ partner: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "New proposal — CollabLevel" },
      { name: "description", content: "Propose a collaboration to one of your connections." },
      { property: "og:title", content: "New proposal — CollabLevel" },
      { property: "og:description", content: "Propose a collaboration to one of your connections." },
    ],
  }),
  component: NewProposal,
});

const schema = z
  .object({
    partnerId: z.string().min(1, "Choose a connection"),
    title: z.string().trim().min(3, "Add a title").max(100),
    purpose: z.string().trim().min(20, "Describe the purpose in at least 20 characters").max(1000),
    deliverables: z.string().trim().min(2, "List at least one deliverable"),
    start: z.string().min(1, "Choose a start date"),
    end: z.string().min(1, "Choose an end date"),
    compensation: z.string().trim().max(120).optional(),
  })
  .refine((v) => !v.start || !v.end || v.end >= v.start, { path: ["end"], message: "End date must be after start date" });

function NewProposal() {
  const { partner } = Route.useSearch();
  const { connections, propose } = useStore();
  const nav = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const connected = connections.filter((c) => c.status === "connected").map((c) => getProfile(c.profileId)!);

  if (connected.length === 0)
    return <EmptyState title="No connections yet" text="You can propose collaborations to people you're connected with." action={<Link to="/app/discover" className={btn.primary}>Discover people</Link>} />;

  return (
    <>
      <PageHeader title="New collaboration proposal" description="Be specific — clear proposals get faster answers." />
      <Panel className="max-w-2xl">
        <form noValidate className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          const r = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
          if (!r.success) return setErrors(toErrors(r.error.issues));
          const v = r.data;
          const id = propose({ ...v, partnerId: v.partnerId, compensation: v.compensation || undefined, deliverables: v.deliverables.split("\n").map((d) => d.trim()).filter(Boolean) });
          toast.success("Proposal sent");
          nav({ to: "/app/collaborations/$id", params: { id } });
        }}>
          <Field label="Send to" error={errors.partnerId}>
            <select name="partnerId" defaultValue={partner ?? ""} className={inputCls} aria-invalid={!!errors.partnerId}>
              <option value="">Choose a connection</option>
              {connected.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Title" error={errors.title}><input name="title" className={inputCls} aria-invalid={!!errors.title} /></Field>
          <Field label="Purpose" error={errors.purpose}><textarea name="purpose" rows={4} className={inputCls} aria-invalid={!!errors.purpose} /></Field>
          <Field label="Deliverables (one per line)" error={errors.deliverables}><textarea name="deliverables" rows={3} className={inputCls} aria-invalid={!!errors.deliverables} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date" error={errors.start}><input type="date" name="start" className={inputCls} aria-invalid={!!errors.start} /></Field>
            <Field label="End date" error={errors.end}><input type="date" name="end" className={inputCls} aria-invalid={!!errors.end} /></Field>
          </div>
          <Field label="Budget or compensation (optional)"><input name="compensation" placeholder="e.g. €1,500 fixed, revenue share, unpaid" className={inputCls} /></Field>
          <p className="text-xs text-muted-foreground">CollabLevel doesn't process payments. Agree payment terms directly with your collaborator.</p>
          <div className="flex justify-end gap-2">
            <Link to="/app/collaborations" className={btn.secondary}>Cancel</Link>
            <button className={btn.primary}>Send proposal</button>
          </div>
        </form>
      </Panel>
    </>
  );
}
