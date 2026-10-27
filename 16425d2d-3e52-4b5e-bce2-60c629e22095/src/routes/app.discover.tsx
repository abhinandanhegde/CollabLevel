import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, PageHeader, ProfileCard, btn } from "@/components/collab/primitives";
import { ConnectButton } from "@/components/collab/connect-button";
import { inputCls } from "@/components/collab/auth-layout";
import { getScore, profiles } from "@/lib/demo-data";
import { ACCOUNT_TYPES, LEVELS, levelFor } from "@/lib/types";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/discover")({
  head: () => ({
    meta: [
      { title: "Discover collaborators — CollabLevel" },
      { name: "description", content: "Search brands, creators, agencies and professionals by type, industry and credibility." },
      { property: "og:title", content: "Discover collaborators — CollabLevel" },
      { property: "og:description", content: "Search brands, creators, agencies and professionals." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { me } = useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [industry, setIndustry] = useState("");
  const [level, setLevel] = useState("");
  const industries = [...new Set(profiles.map((p) => p.industry))].sort();

  const results = useMemo(() => {
    const t = q.toLowerCase().trim();
    return profiles.filter((p) => {
      if (p.id === me.id) return false;
      if (type && p.accountType !== type) return false;
      if (industry && p.industry !== industry) return false;
      if (level && levelFor(getScore(p.id).score).level < Number(level)) return false;
      if (!t) return true;
      return [p.name, p.headline, p.bio, ...p.skills].join(" ").toLowerCase().includes(t);
    });
  }, [q, type, industry, level, me.id]);

  const reset = () => { setQ(""); setType(""); setIndustry(""); setLevel(""); };
  const sel = `${inputCls} md:w-auto`;

  return (
    <>
      <PageHeader title="Discover" description="Find professionals whose work and interests fit your next project." />
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, skill or expertise" aria-label="Search" className={`${inputCls} pl-9`} />
        </div>
        <div className="mt-3 flex flex-col gap-2 md:flex-row md:flex-wrap">
          <select aria-label="Account type" value={type} onChange={(e) => setType(e.target.value)} className={sel}>
            <option value="">All account types</option>
            {ACCOUNT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <select aria-label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className={sel}>
            <option value="">All industries</option>
            {industries.map((i) => <option key={i}>{i}</option>)}
          </select>
          <select aria-label="Minimum level" value={level} onChange={(e) => setLevel(e.target.value)} className={sel}>
            <option value="">Any credibility level</option>
            {LEVELS.slice(1).map((l) => <option key={l.level} value={l.level}>Level {l.level}+ · {l.name}</option>)}
          </select>
          {(q || type || industry || level) && <button onClick={reset} className={btn.ghost}>Clear filters</button>}
        </div>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">{results.length} {results.length === 1 ? "profile" : "profiles"}</p>
      {results.length === 0 ? (
        <EmptyState title="No profiles match" text="Try removing a filter or searching for a broader skill." action={<button onClick={reset} className={btn.secondary}>Clear filters</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => <ProfileCard key={p.id} profile={p} action={<ConnectButton profileId={p.id} />} />)}
        </div>
      )}
    </>
  );
}
