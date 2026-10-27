// In-memory session store over the demo data. Swap these actions for
// Lovable Cloud queries when the backend is connected; nothing persists yet.
import { createContext, useContext, useState, type ReactNode } from "react";
import * as demo from "./demo-data";
import type { Collaboration, CollabStatus, Connection, Notification, Profile } from "./types";

interface Store {
  me: Profile;
  connections: Connection[];
  collaborations: Collaboration[];
  notifications: Notification[];
  connect: (profileId: string) => void;
  respondConnection: (id: string, accept: boolean) => void;
  withdrawConnection: (id: string) => void;
  setCollabStatus: (id: string, status: CollabStatus) => void;
  toggleMilestone: (id: string, index: number) => void;
  confirmCompletion: (id: string) => void;
  propose: (c: Omit<Collaboration, "id" | "status" | "milestones">) => string;
  markAllRead: () => void;
  updateMe: (p: Partial<Profile>) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Profile>(demo.getProfile(demo.ME_ID)!);
  const [connections, setConnections] = useState(demo.connections);
  const [collaborations, setCollabs] = useState(demo.collaborations);
  const [notifications, setNotifications] = useState(demo.notifications);

  const store: Store = {
    me,
    connections,
    collaborations,
    notifications,
    connect: (profileId) =>
      setConnections((c) =>
        c.some((x) => x.profileId === profileId)
          ? c
          : [...c, { id: crypto.randomUUID(), profileId, status: "sent", date: new Date().toISOString().slice(0, 10) }],
      ),
    respondConnection: (id, accept) =>
      setConnections((c) =>
        accept ? c.map((x) => (x.id === id ? { ...x, status: "connected" } : x)) : c.filter((x) => x.id !== id),
      ),
    withdrawConnection: (id) => setConnections((c) => c.filter((x) => x.id !== id)),
    setCollabStatus: (id, status) =>
      setCollabs((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c))),
    toggleMilestone: (id, i) =>
      setCollabs((cs) =>
        cs.map((c) =>
          c.id === id ? { ...c, milestones: c.milestones.map((m, j) => (j === i ? { ...m, done: !m.done } : m)) } : c,
        ),
      ),
    confirmCompletion: (id) =>
      setCollabs((cs) =>
        cs.map((c) =>
          c.id === id
            ? { ...c, confirmedByMe: true, status: c.confirmedByPartner ? "completed" : c.status }
            : c,
        ),
      ),
    propose: (c) => {
      const id = crypto.randomUUID().slice(0, 8);
      setCollabs((cs) => [
        { ...c, id, status: "sent", milestones: [{ title: "Kick-off", due: c.start, done: false }] },
        ...cs,
      ]);
      return id;
    },
    markAllRead: () => setNotifications((n) => n.map((x) => ({ ...x, read: true }))),
    updateMe: (p) => setMe((m) => ({ ...m, ...p })),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
