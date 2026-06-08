"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "./AppShell";
import { getToken } from "@/lib/auth";

/** Admin session gate. Without a token the only reachable route is /login. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const check = () => setAuthed(!!getToken());
    check();
    setReady(true);
    window.addEventListener("relay-admin-auth", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("relay-admin-auth", check);
      window.removeEventListener("storage", check);
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
