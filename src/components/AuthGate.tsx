"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "./AppShell";
import { apiGet } from "@/lib/api";
import { clearSession, getToken } from "@/lib/auth";

/** Admin session gate. Without a token the only reachable route is /login. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!getToken()) {
        setAuthed(false);
        setReady(true);
        return;
      }
      try {
        const me = await apiGet<{ admin: boolean }>("/v1/auth/me");
        if (!me.admin) throw new Error("Admin access required");
        setAuthed(true);
      } catch {
        if (getToken()) clearSession();
        setAuthed(false);
      } finally {
        setReady(true);
      }
    };
    void check();
    const onSessionChange = () => void check();
    window.addEventListener("relay-admin-auth", onSessionChange);
    window.addEventListener("storage", onSessionChange);
    return () => {
      window.removeEventListener("relay-admin-auth", onSessionChange);
      window.removeEventListener("storage", onSessionChange);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!authed && pathname !== "/login") router.replace("/login");
    if (authed && pathname === "/login") router.replace("/");
  }, [ready, authed, pathname, router]);

  if (!ready) {
    return <div style={{ height: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <span style={{ width: 24, height: 24, border: "3px solid var(--line-3)", borderTopColor: "var(--acc)", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
    </div>;
  }
  if (pathname === "/login") return <>{children}</>;
  if (!authed) return null;
  return <AppShell>{children}</AppShell>;
}
