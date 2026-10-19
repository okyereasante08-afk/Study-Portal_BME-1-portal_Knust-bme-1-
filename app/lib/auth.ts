// lib/auth.ts
// Optional Supabase Auth (email + password) for the Community feed.
// This sits alongside the student-ID roster login; neither is required to use the portal.

import type { AuthError, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const MIN_PASSWORD_LENGTH = 8;

export type AuthResult = { ok: true } | { ok: false; message: string };
export type SignUpResult =
  | { ok: true; needsConfirmation: boolean }
  | { ok: false; message: string };

/** Name shown on posts: full name from sign-up, else the part of the email before "@". */
export function displayNameOf(user: User): string {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const raw = typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : "";
  const name = raw.trim();
  if (name) return name;
  return user.email ? user.email.split("@")[0] : "BME Student";
}

/** Turns Supabase error codes into short, user-facing messages. */
function friendly(error: AuthError): string {
  const code = (error as { code?: string }).code ?? "";
  const msg = (error.message ?? "").toLowerCase();

  if (code === "invalid_credentials" || msg.includes("invalid login credentials"))
    return "Incorrect email or password.";
  if (code === "email_not_confirmed" || msg.includes("email not confirmed"))
    return "Please confirm your email first. Check your inbox for the confirmation link.";
  if (code === "user_already_exists" || msg.includes("already registered"))
    return "An account with this email already exists. Sign in instead.";
  if (code === "weak_password" || msg.includes("password should"))
    return `Choose a stronger password (at least ${MIN_PASSWORD_LENGTH} characters).`;
  if (code === "same_password")
    return "Your new password must be different from the old one.";
  if (code === "signup_disabled")
    return "Account sign-up is currently disabled.";
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    error.status === 429 ||
    msg.includes("rate limit")
  )
    return "Too many attempts. Please wait a few minutes and try again.";
  if (msg.includes("failed to fetch") || msg.includes("network"))
    return "Network error. Check your connection and try again.";
  return "Something went wrong. Please try again.";
}

const norm = (email: string) => email.trim().toLowerCase();

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  redirectTo: string
): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email: norm(email),
    password,
    options: { data: { full_name: fullName.trim() }, emailRedirectTo: redirectTo },
  });
  if (error) return { ok: false, message: friendly(error) };

  // With email confirmation on, Supabase hides duplicates by returning a user with no identities.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0)
    return { ok: false, message: "An account with this email already exists. Sign in instead." };

  return { ok: true, needsConfirmation: !data.session };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email: norm(email), password });
  return error ? { ok: false, message: friendly(error) } : { ok: true };
}

export async function resendConfirmation(email: string, redirectTo: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: norm(email),
    options: { emailRedirectTo: redirectTo },
  });
  return error ? { ok: false, message: friendly(error) } : { ok: true };
}

export async function sendPasswordReset(email: string, redirectTo: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(norm(email), { redirectTo });
  return error ? { ok: false, message: friendly(error) } : { ok: true };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error ? { ok: false, message: friendly(error) } : { ok: true };
}

/** Signs out this device only; other devices stay signed in. */
export async function signOutAccount(): Promise<void> {
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    /* ignore: local state is cleared by the auth listener regardless */
  }
}
