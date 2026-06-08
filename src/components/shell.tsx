"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { clearSession, getUser, type AdminUser } from "@/lib/auth";

/* ---------------- Sparkline ---------------- */
export function Spark({ data, color = "var(--acc)", w = 120, h = 34, fill = true }: { data: number[]; color?: string; w?: number; h?: number; fill?: boolean }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data), min = Math.min(...data), rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 4 - ((v - min) / rng) * (h - 8)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${w} ${h} L0 ${h} Z`;
  const id = "sg" + Math.random().toString(36).slice(2, 7);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Mini bars ---------------- */
export function Bars({ data, accentLast = true }: { data: number[]; accentLast?: boolean }) {
  const max = Math.max(...data) || 1;
  return (
    <div className="bars">
      {data.map((v, i) => (
        <i key={i} className={accentLast && i === data.length - 1 ? "acc" : ""} style={{ height: (v / max) * 100 + "%" }} />
      ))}
    </div>
  );
}

/* ---------------- KPI tile ---------------- */
export function KPI({ label, value, delta, series, bad, icon }: { label: string; value: string; delta?: number; series?: number[]; bad?: boolean; icon?: string }) {
  const dir = delta === undefined ? "neutral" : delta > 0 ? (bad ? "down" : "up") : delta < 0 ? (bad ? "up" : "down") : "neutral";
  const color = dir === "up" ? "var(--ok)" : dir === "down" ? "var(--crit)" : "var(--tx-3)";
  return (
    <div className="kpi">
      <div className="kl">{icon && <Icon name={icon} size={13} />}{label}</div>
      <div className="kv">{value}</div>
      {delta !== undefined && (
        <div className={"kd " + dir}>
          <Icon name="pulse" size={11} />
          {(delta > 0 ? "+" : "") + delta}{Math.abs(delta) < 100 ? "%" : ""} <span className="faint">7d</span>
        </div>
      )}
      {series && <div className="spark"><Spark data={series} color={color} w={300} h={34} /></div>}
    </div>
  );
}

/* ---------------- Status pill ---------------- */
const PILL_MAP: Record<string, string> = {
  ok: "ok", healthy: "ok", active: "ok", running: "info", completed: "ok", warn: "warn", warning: "warn",
  crit: "crit", critical: "crit", firing: "crit", failed: "crit", error: "crit", past_due: "warn", suspended: "crit",
  acked: "info", resolved: "ok", terminated: "warn", queued: "info", delivered: "ok", bounced: "crit", idle: "",
};
export function StatusPill({ status, children }: { status: string; children?: React.ReactNode }) {
  const cls = PILL_MAP[status] ?? "";
  return (
    <span className={"pill " + cls}>
      <span className={"dot " + (cls || "idle")} />
      {children || status}
    </span>
  );
}

/* ---------------- Clock ---------------- */
export function useClock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ---------------- Sidebar ---------------- */
const NAVSECTIONS = [
  { label: "Operate", items: [
    { href: "/", name: "Mission Control", icon: "pulse" },
    { href: "/workflows", name: "Workflows", icon: "flow", badge: "3" },
    { href: "/adapters", name: "Adapters", icon: "plug", badge: "2", badgeCls: "warn" },
  ] },
  { label: "Govern", items: [
    { href: "/tenants", name: "Tenants", icon: "tenants" },
    { href: "/security", name: "Access & Security", icon: "shield", badge: "1", badgeCls: "crit" },
    { href: "/alerts", name: "Alerts", icon: "bell", badge: "3", badgeCls: "crit" },
    { href: "/logs", name: "Logs & Audit", icon: "logs" },
  ] },
  { label: "Engage", items: [
    { href: "/notifications", name: "Notifications", icon: "mail" },
    { href: "/flags", name: "Feature Flags", icon: "flag" },
  ] },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  useEffect(() => { setUser(getUser()); }, []);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const logout = () => { clearSession(); router.replace("/login"); };
  return (
    <aside className="sb">
      <div className="sb-top">
        <div className="sb-logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: "relative" }}>
            <path d="M3 12h4l2-7 4 14 2-7h6" stroke="var(--acc)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="sb-brand"><b>Relay</b><span>Ops Console</span></div>
        <div className="mla" style={{ marginRight: -4 }}>
          <div className="icon-btn" style={{ width: 26, height: 26, border: "none", background: "transparent" }} onClick={() => setCollapsed(!collapsed)}>
            <Icon name="collapse" size={15} />
          </div>
        </div>
      </div>
      <div className="sb-scroll">
        {NAVSECTIONS.map((sec) => (
          <div key={sec.label}>
            <div className="sb-sec">{sec.label}</div>
            {sec.items.map((it) => (
              <Link key={it.href} href={it.href} className={"nav" + (isActive(it.href) ? " active" : "")} title={it.name}>
                <Icon name={it.icon} size={17} />
                <span className="nav-label">{it.name}</span>
                {it.badge && <span className={"nav-badge " + (it.badgeCls || "")}>{it.badge}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-ava">{(user?.name ?? "OP").slice(0, 2).toUpperCase()}</div>
          <div className="sb-user-meta"><b>{user?.email ?? "ops@relay.io"}</b><span>Platform admin</span></div>
          <div className="mla nav-label icon-btn" title="Sign out" onClick={logout} style={{ width: 26, height: 26, border: "none", background: "transparent" }}>
            <Icon name="ext" size={15} style={{ color: "var(--tx-3)" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- Topbar ---------------- */
const VIEW_TITLES: Record<string, [string, string]> = {
  "/": ["Mission Control", "live · all systems"],
  "/workflows": ["Workflows & Jobs", "temporal"],
  "/adapters": ["Adapter Fleet", "cross-tenant"],
  "/tenants": ["Tenants", "248 orgs"],
  "/alerts": ["Alerts & Incidents", "3 firing"],
  "/security": ["Access & Security", "sessions"],
  "/logs": ["Logs & Audit", "stream"],
  "/notifications": ["Notifications", "email"],
  "/flags": ["Feature Flags", "config"],
};
export function Topbar() {
  const pathname = usePathname();
  const t = useClock();
  const key = pathname === "/" ? "/" : "/" + (pathname.split("/")[1] || "");
  const [title, crumb] = VIEW_TITLES[key] || ["", ""];
  return (
    <header className="tb">
      <div className="tb-title">
        <h1>{title}</h1>
        <span className="crumb">/ {crumb}</span>
      </div>
      <div className="tb-spacer" />
      <div className="searchbox"><Icon name="search" size={14} /><span>Search tenants, workflows, logs…</span><kbd>⌘K</kbd></div>
      <div className="envpill"><span className="pd" />PRODUCTION</div>
      <div className="clock">{t ? t.toLocaleTimeString("en-US", { hour12: false }) : "--:--:--"} UTC</div>
      <div className="icon-btn"><Icon name="refresh" size={15} /></div>
      <div className="icon-btn"><Icon name="bell" size={15} /></div>
    </header>
  );
}

/* ---------------- Drawer ---------------- */
export function Drawer({ title, sub, onClose, children, actions }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode; actions?: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-h">
          <div className="f1" style={{ minWidth: 0 }}>
            <div className="b" style={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
            {sub && <div className="mono-sm muted" style={{ marginTop: 2 }}>{sub}</div>}
          </div>
          {actions}
          <div className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></div>
        </div>
        <div className="drawer-b">{children}</div>
      </div>
    </>
  );
}
