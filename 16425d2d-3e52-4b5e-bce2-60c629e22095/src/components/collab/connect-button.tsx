import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { btn } from "./primitives";
import { cn } from "@/lib/utils";

export function ConnectButton({ profileId, className }: { profileId: string; className?: string }) {
  const { connections, connect, me } = useStore();
  if (profileId === me.id) return null;
  const c = connections.find((x) => x.profileId === profileId);
  if (c) {
    const label = c.status === "connected" ? "Connected" : c.status === "sent" ? "Request sent" : "Respond in Connections";
    return <button disabled className={cn(btn.secondary, "flex-1 py-1.5", className)}>{label}</button>;
  }
  return (
    <button
      className={cn(btn.primary, "flex-1 py-1.5", className)}
      onClick={() => {
        connect(profileId);
        toast.success("Connection request sent");
      }}
    >
      Connect
    </button>
  );
}
