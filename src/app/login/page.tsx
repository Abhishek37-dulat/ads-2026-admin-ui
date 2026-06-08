"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { apiPost } from "@/lib/api";
import { setSession } from "@/lib/auth";

interface AuthResp {
  token: string;
  user: { email: string; name: string };
  admin: boolean;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const r = await apiPost<AuthResp>("/v1/auth/login", { email, password });
      if (!r.admin) {
        setError("This account doesn't have Ops console access.");
        return;
      }
      setSession(r.token, r.user);
      router.replace("/");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const valid = email.includes("@") && password.length > 0;

  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 380, padding: 24 }}>
        <div className="flex ac g10" style={{ marginBottom: 22 }}>
          <div className="sb-logo" style={{ width: 34, height: 34 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: "relative" }}>
              <path d="M3 12h4l2-7 4 14 2-7h6" stroke="var(--acc)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="sb-brand"><b style={{ fontSize: 16 }}>Relay</b><span>Ops Console</span></div>
        </div>

        <div className="card" style={{ padding: 26 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.01em" }}>Operator sign-in</h2>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 5 }}>Platform admins only. Tenant accounts can&apos;t enter here.</div>

          <div className="dlabel" style={{ marginTop: 20 }}>Email</div>
          <div className="searchbox" style={{ width: "100%", background: "var(--bg-2)" }}>
            <Icon name="mail" size={14} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@relay.dev" type="email"
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--tx)", fontSize: 13, width: "100%", fontFamily: "var(--sans)" }} />
          </div>

          <div className="dlabel" style={{ marginTop: 14 }}>Password</div>
          <div className="searchbox" style={{ width: "100%", background: "var(--bg-2)" }}>
            <Icon name="shield" size={14} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && valid && submit()}
              style={{ background: "transparent", border: "none", outline: "none", color: "var(--tx)", fontSize: 13, width: "100%", fontFamily: "var(--sans)" }} />
            <span onClick={() => setShow((s) => !s)} style={{ cursor: "pointer", color: "var(--tx-3)" }}><Icon name="eye" size={14} /></span>
          </div>

          {error && (
            <div className="flex ac g8" style={{ color: "var(--crit)", fontSize: 12.5, marginTop: 12 }}>
              <Icon name="alert" size={14} /> {error}
            </div>
          )}

          <button className="btn acc" style={{ width: "100%", marginTop: 18, justifyContent: "center" }} disabled={busy || !valid} onClick={submit}>
            {busy ? <span style={{ width: 14, height: 14, border: "2px solid rgba(4,18,11,.4)", borderTopColor: "#04120B", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} /> : <Icon name="shield" size={15} />}
            Sign in
          </button>
        </div>

        <div className="muted tc" style={{ fontSize: 11, marginTop: 16 }}>Relay platform operations · access is audited</div>
      </div>
    </div>
  );
}
