// DEMONSTRATION DATA ONLY. Every person, collaboration and review here is fictional.
// The UI labels this content as "Demo" — never present it as verified fact.
import type {
  Collaboration,
  Connection,
  CredibilityScore,
  Notification,
  Profile,
  Review,
} from "./types";

export const ME_ID = "me";

export const profiles: Profile[] = [
  {
    id: "me",
    name: "Alex Moreno",
    handle: "alexmoreno",
    accountType: "independent",
    headline: "Brand strategist for consumer and lifestyle companies",
    bio: "I help early-stage brands find their voice and pair them with the creators who can carry it. Ten years across agency and in-house roles.",
    location: "Lisbon, Portugal",
    industry: "Branding & Strategy",
    skills: ["Brand strategy", "Positioning", "Creator partnerships", "Workshops"],
    interests: ["Product launches", "Sustainable brands", "Long-term retainers"],
    links: [
      { label: "Website", url: "https://example.com" },
      { label: "LinkedIn", url: "https://linkedin.com" },
    ],
    portfolio: [
      { title: "Rebrand for a coffee roaster", description: "Positioning, naming and launch plan.", tone: "terracotta" },
      { title: "Creator program playbook", description: "Framework for a 20-creator ambassador program.", tone: "olive" },
    ],
    typeFields: [
      { label: "Availability", value: "2 days / week" },
      { label: "Engagement types", value: "Project, retainer" },
    ],
    verification: "pending",
  },
  {
    id: "p1",
    name: "Terra & Loom",
    handle: "terraloom",
    accountType: "brand",
    headline: "Handmade home textiles, made in small batches",
    bio: "A ceramics and textile brand working with artisans across southern Europe. We look for creators who care about craft.",
    location: "Porto, Portugal",
    industry: "Home & Lifestyle",
    skills: ["Product design", "Retail", "Sustainability"],
    interests: ["Creator campaigns", "Photography", "Pop-up events"],
    links: [{ label: "Shop", url: "https://example.com" }],
    portfolio: [
      { title: "Autumn collection lookbook", description: "Shot with three independent photographers.", tone: "sand" },
      { title: "Studio pop-up", description: "Weekend market with local makers.", tone: "terracotta" },
    ],
    typeFields: [
      { label: "Company size", value: "11–50" },
      { label: "Typical budget", value: "€2k–€10k per campaign" },
    ],
    verification: "verified",
  },
  {
    id: "p2",
    name: "Maya Okafor",
    handle: "mayaokafor",
    accountType: "creator",
    headline: "Slow-living and interiors creator",
    bio: "I make calm, considered content about homes, rituals and the objects in them.",
    location: "London, UK",
    industry: "Interiors & Lifestyle",
    skills: ["Short-form video", "Photography", "Storytelling"],
    interests: ["Home brands", "Long-term ambassadorships"],
    links: [{ label: "Instagram", url: "https://instagram.com" }],
    portfolio: [
      { title: "Morning rituals series", description: "12-part video series.", tone: "mustard" },
      { title: "Small-space styling", description: "Guide for renters.", tone: "olive" },
    ],
    typeFields: [
      { label: "Audience size", value: "84k across platforms" },
      { label: "Primary platform", value: "Instagram" },
    ],
    verification: "verified",
  },
  {
    id: "p3",
    name: "Northbound Studio",
    handle: "northbound",
    accountType: "agency",
    headline: "Independent creative agency for purpose-led brands",
    bio: "Strategy, identity and campaigns for brands that want to do more good than harm.",
    location: "Copenhagen, Denmark",
    industry: "Creative Services",
    skills: ["Identity", "Campaigns", "Art direction"],
    interests: ["Creator partnerships", "Startups"],
    links: [{ label: "Website", url: "https://example.com" }],
    portfolio: [{ title: "Identity system for a B Corp", description: "Logo, type and tone.", tone: "olive" }],
    typeFields: [
      { label: "Team size", value: "14" },
      { label: "Services", value: "Brand, campaign, content" },
    ],
    verification: "unverified",
  },
  {
    id: "p4",
    name: "Lena Varga",
    handle: "lenavarga",
    accountType: "artist",
    headline: "Editorial model and illustrator",
    bio: "Working between Budapest and Paris on editorial shoots and illustrated brand stories.",
    location: "Budapest, Hungary",
    industry: "Fashion & Art",
    skills: ["Modelling", "Illustration", "Art direction"],
    interests: ["Editorial", "Brand illustration"],
    links: [{ label: "Portfolio", url: "https://example.com" }],
    portfolio: [{ title: "Illustrated packaging", description: "For a tea brand.", tone: "mustard" }],
    typeFields: [
      { label: "Represented by", value: "Independent" },
      { label: "Disciplines", value: "Modelling, illustration" },
    ],
    verification: "pending",
  },
  {
    id: "p5",
    name: "Fieldnote",
    handle: "fieldnote",
    accountType: "startup",
    headline: "A journaling app for outdoor people",
    bio: "Seed-stage team building a quieter way to record time outdoors.",
    location: "Berlin, Germany",
    industry: "Consumer Tech",
    skills: ["Product", "Community"],
    interests: ["Creator launches", "Outdoor clubs"],
    links: [{ label: "Website", url: "https://example.com" }],
    portfolio: [{ title: "Beta launch", description: "2,000 early users.", tone: "olive" }],
    typeFields: [
      { label: "Stage", value: "Seed" },
      { label: "Team size", value: "6" },
    ],
    verification: "unverified",
  },
  {
    id: "p6",
    name: "Riverside Running Club",
    handle: "riversiderc",
    accountType: "community",
    headline: "Weekly community runs, 400 members",
    bio: "Free, friendly runs every Sunday. Open to partnerships that serve our members.",
    location: "Amsterdam, Netherlands",
    industry: "Sport & Community",
    skills: ["Events", "Community building"],
    interests: ["Sponsorships", "Local brands"],
    links: [{ label: "Strava", url: "https://strava.com" }],
    portfolio: [{ title: "Charity 10k", description: "Raised funds for a local shelter.", tone: "terracotta" }],
    typeFields: [
      { label: "Members", value: "400" },
      { label: "Meet-ups", value: "Weekly" },
    ],
    verification: "verified",
  },
  {
    id: "p7",
    name: "Sam Whitfield",
    handle: "samwhit",
    accountType: "marketer",
    headline: "Growth marketer for DTC brands",
    bio: "Paid social, lifecycle and creator-led growth for direct-to-consumer brands.",
    location: "Manchester, UK",
    industry: "Marketing",
    skills: ["Paid social", "Lifecycle", "Analytics"],
    interests: ["DTC brands", "Creator ads"],
    links: [{ label: "LinkedIn", url: "https://linkedin.com" }],
    portfolio: [{ title: "Creator ad testing", description: "Framework for testing creator content.", tone: "sand" }],
    typeFields: [
      { label: "Channels", value: "Meta, TikTok, email" },
      { label: "Availability", value: "Open to projects" },
    ],
    verification: "unverified",
  },
];

export const scores: CredibilityScore[] = profiles.map((p, i) => {
  const base = [48, 82, 71, 58, 39, 22, 64, 33][i] ?? 30;
  return {
    profileId: p.id,
    score: base,
    breakdown: [
      { label: "Completed collaborations", value: Math.round(base * 0.4), max: 40 },
      { label: "Eligible reviews", value: Math.round(base * 0.3), max: 30 },
      { label: "Profile completeness", value: Math.round(base * 0.15), max: 15 },
      { label: "Responsiveness", value: Math.round(base * 0.15), max: 15 },
    ],
  };
});

export const connections: Connection[] = [
  { id: "c1", profileId: "p1", status: "connected", date: "2026-08-14" },
  { id: "c2", profileId: "p2", status: "connected", date: "2026-09-02" },
  { id: "c3", profileId: "p3", status: "incoming", note: "We're building a creator roster for a client — would love to chat.", date: "2026-10-22" },
  { id: "c4", profileId: "p6", status: "incoming", date: "2026-10-24" },
  { id: "c5", profileId: "p5", status: "sent", date: "2026-10-20" },
];

export const collaborations: Collaboration[] = [
  {
    id: "k1",
    title: "Winter ritual campaign",
    partnerId: "p1",
    status: "active",
    purpose: "Position Terra & Loom's winter range around slow mornings, paired with two interiors creators.",
    deliverables: ["Campaign brief", "Creator shortlist", "Launch timeline"],
    start: "2026-10-01",
    end: "2026-12-15",
    compensation: "€4,500 fixed fee",
    milestones: [
      { title: "Kick-off workshop", due: "2026-10-05", done: true },
      { title: "Creator shortlist approved", due: "2026-10-30", done: false },
      { title: "Campaign live", due: "2026-12-01", done: false },
    ],
  },
  {
    id: "k2",
    title: "Club partner programme",
    partnerId: "p6",
    status: "incoming",
    purpose: "Help the club design a fair, member-first partnership offer for local brands.",
    deliverables: ["Partnership deck", "Pricing guidance"],
    start: "2026-11-10",
    end: "2026-12-20",
    compensation: "Volunteer / unpaid",
    milestones: [{ title: "Discovery call", due: "2026-11-12", done: false }],
  },
  {
    id: "k3",
    title: "Launch positioning sprint",
    partnerId: "p5",
    status: "sent",
    purpose: "Two-week sprint to sharpen Fieldnote's positioning before public launch.",
    deliverables: ["Positioning statement", "Messaging guide"],
    start: "2026-11-15",
    end: "2026-11-29",
    compensation: "€2,000",
    milestones: [{ title: "Sprint kick-off", due: "2026-11-15", done: false }],
  },
  {
    id: "k4",
    title: "Morning rituals series",
    partnerId: "p2",
    status: "completed",
    purpose: "Strategy support for Maya's 12-part branded series.",
    deliverables: ["Series concept", "Brand-partner outreach"],
    start: "2026-06-01",
    end: "2026-08-30",
    compensation: "Revenue share",
    milestones: [
      { title: "Concept agreed", due: "2026-06-10", done: true },
      { title: "Series published", due: "2026-08-30", done: true },
    ],
    confirmedByMe: true,
    confirmedByPartner: true,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    collaborationId: "k4",
    authorId: "p2",
    rating: 5,
    text: "Alex shaped the series into something brands actually understood. Clear, calm, and always on time.",
    date: "2026-09-04",
  },
];

export const notifications: Notification[] = [
  { id: "n1", kind: "connection", text: "Riverside Running Club sent you a connection request.", date: "2026-10-24", read: false, href: "/app/connections" },
  { id: "n2", kind: "connection", text: "Northbound Studio sent you a connection request.", date: "2026-10-22", read: false, href: "/app/connections" },
  { id: "n3", kind: "proposal", text: "New proposal: Club partner programme.", date: "2026-10-21", read: false, href: "/app/collaborations/k2" },
  { id: "n4", kind: "milestone", text: "Milestone due soon: Creator shortlist approved.", date: "2026-10-20", read: true, href: "/app/collaborations/k1" },
  { id: "n5", kind: "review", text: "Maya Okafor left a review on Morning rituals series.", date: "2026-09-04", read: true, href: "/app/credibility" },
];

export const getProfile = (id: string) => profiles.find((p) => p.id === id);
export const getScore = (id: string) => scores.find((s) => s.profileId === id)!;

export function profileCompletion(p: Profile) {
  const checks = [
    p.bio.length > 40,
    p.skills.length >= 3,
    p.interests.length > 0,
    p.links.length > 0,
    p.portfolio.length >= 2,
    p.typeFields.length > 0,
    p.verification === "verified",
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
