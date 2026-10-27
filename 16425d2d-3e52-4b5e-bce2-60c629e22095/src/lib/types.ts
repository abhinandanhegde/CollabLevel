// Domain types — kept separate per entity so each maps cleanly to its own table later.

export const ACCOUNT_TYPES = [
  { id: "brand", label: "Brand or company", short: "Brand" },
  { id: "startup", label: "Startup", short: "Startup" },
  { id: "creator", label: "Creator or influencer", short: "Creator" },
  { id: "artist", label: "Model or artist", short: "Artist" },
  { id: "agency", label: "Agency", short: "Agency" },
  { id: "marketer", label: "Marketer", short: "Marketer" },
  { id: "independent", label: "Independent professional", short: "Independent" },
  { id: "community", label: "Club or community organisation", short: "Community" },
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number]["id"];

export const LEVELS = [
  { level: 1, name: "Emerging", min: 0 },
  { level: 2, name: "Established", min: 30 },
  { level: 3, name: "Trusted", min: 55 },
  { level: 4, name: "Distinguished", min: 75 },
  { level: 5, name: "Exemplary", min: 90 },
] as const;

export type VerificationStatus = "unverified" | "pending" | "verified";

export interface Profile {
  id: string;
  name: string;
  handle: string;
  accountType: AccountType;
  headline: string;
  bio: string;
  location: string;
  industry: string;
  skills: string[];
  interests: string[];
  links: { label: string; url: string }[];
  portfolio: { title: string; description: string; tone: "terracotta" | "olive" | "mustard" | "sand" }[];
  /** Account-type-specific key/value facts (e.g. audience size, team size). */
  typeFields: { label: string; value: string }[];
  verification: VerificationStatus;
}

export interface CredibilityScore {
  profileId: string;
  score: number; // 0-100, placeholder until real calculation exists
  breakdown: { label: string; value: number; max: number }[];
}

export type ConnectionStatus = "connected" | "incoming" | "sent";
export interface Connection {
  id: string;
  profileId: string;
  status: ConnectionStatus;
  note?: string | undefined;
  date: string;
}

export type CollabStatus = "incoming" | "sent" | "active" | "completed" | "declined";
export interface Milestone {
  title: string;
  due: string;
  done: boolean;
}
export interface Collaboration {
  id: string;
  title: string;
  partnerId: string;
  status: CollabStatus;
  purpose: string;
  deliverables: string[];
  start: string;
  end: string;
  compensation?: string | undefined;
  milestones: Milestone[];
  confirmedByMe?: boolean | undefined;
  confirmedByPartner?: boolean;
}

export interface Review {
  id: string;
  collaborationId: string;
  authorId: string;
  rating: number;
  text: string;
  date: string;
}

export interface Notification {
  id: string;
  kind: "connection" | "proposal" | "milestone" | "review" | "system";
  text: string;
  date: string;
  read: boolean;
  href?: string | undefined;
}

export function levelFor(score: number) {
  return [...LEVELS].reverse().find((l) => score >= l.min)!;
}

export function nextLevel(score: number) {
  return LEVELS.find((l) => l.min > score);
}

export function accountLabel(id: AccountType, short = false) {
  const t = ACCOUNT_TYPES.find((a) => a.id === id)!;
  return short ? t.short : t.label;
}
