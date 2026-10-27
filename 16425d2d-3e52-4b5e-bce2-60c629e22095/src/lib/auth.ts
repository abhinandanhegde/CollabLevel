import type { AuthError } from "@supabase/supabase-js";

/** Turn Supabase Auth errors into plain, user-friendly messages. */
export function friendlyAuthError(error: AuthError | Error | null | undefined): string {
  if (!error) return "Something went wrong. Please try again.";
  const msg = error.message.toLowerCase();
  if (msg.includes("invalid login credentials")) return "Incorrect email or password.";
  if (msg.includes("email not confirmed")) return "Please confirm your email first — check your inbox for the link.";
  if (msg.includes("already registered") || msg.includes("already exists")) return "An account with this email already exists. Try signing in.";
  if (msg.includes("password") && (msg.includes("weak") || msg.includes("at least"))) return "That password is too weak. Use at least 8 characters with a mix of letters and numbers.";
  if (msg.includes("rate limit") || msg.includes("too many")) return "Too many attempts. Please wait a minute and try again.";
  if (msg.includes("signups not allowed") || msg.includes("signup is disabled")) return "New sign-ups are currently disabled.";
  if (msg.includes("failed to fetch") || msg.includes("network")) return "Can't reach the server. Check your connection and try again.";
  return error.message;
}

/** Only allow same-origin relative redirect paths. */
export function safeRedirect(path: string | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/app/dashboard";
  return path;
}
