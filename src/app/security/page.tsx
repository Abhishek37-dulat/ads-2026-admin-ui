"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Drawer, KPI, StatusPill } from "@/components/shell";
import { fmt } from "@/lib/ops";
import { AUTH_EVENTS, DEVICE_MIX, EVENT_META, METHOD_MIX, POSTURE, SESSIONS, type Session, riskTone } from "@/lib/sec";

const D_ICON: Record<string, string> = { desktop: "cpu", mobile: "plug", tablet: "grid" };
const TILES: [string, string, keyof typeof POSTURE][] = [
  ["Active sessions", "user", "activeSessions"],
  ["Logins 24h", "check", "logins24"],
  ["Failed 24h", "x", "failed24"],
  ["MFA coverage", "shield", "mfaCoverage"],
  ["Suspicious", "alert", "suspicious"],
];

export default function SecurityPage() {
  const [tab, setTab] = useState<"sessions" | "events">("sessions");
  const [sel, setSel] = useState<Session | null>(null);
  const [risk, setRisk] = useState("all");
  const sessions = SESSIONS.filter((s) => risk === "all" || s.risk === risk);

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Access &amp; Security</h2><div className="sub">Sessions, login source, device fingerprints &amp; auth forensics</div></div>
        <div className="flex g8">
          <button className="btn ghost sm"><Icon name="shield" size={14} />Policy</button>
          <button className="btn danger sm"><Icon name="x" size={14} />Revoke all suspicious</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(5,1fr)", marginBottom: 14 }}>
        {TILES.map(([label, icon, key]) => {
          const d = POSTURE[key];
          return <KPI key={label} label={label} value={d.v} delta={d.d} bad={d.bad} icon={icon} />;
        })}
      </div>

      <div className="row" style={{ marginBottom: 14 }}>
        <div className="card f1">
          <div className="card-h"><Icon name="shield" size={15} style={{ color: "var(--acc)" }} /><h3>Authentication methods</h3><span className="k mla">all sessions</span></div>
          <div className="card-b" style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {METHOD_MIX.map((m) => (
              <div key={m.k} className="flex ac g10">
                <span className="b" style={{ fontSize: 12.5, width: 170, flex: "0 0 170px" }}>{m.k}</span>
                <div className="meter f1"><i style={{ width: m.v + "%", background: m.color }} /></div>
                <span className="mono-sm" style={{ width: 36, textAlign: "right", color: m.color }}>{m.v}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ flex: ".7" }}>
          <div className="card-h"><Icon name="cpu" size={15} style={{ color: "var(--blue)" }} /><h3>Device mix</h3></div>
          <div className="card-b" style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <DonutMix data={DEVICE_MIX} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {DEVICE_MIX.map((d) => (
                <div key={d.k} className="flex ac g8">
                  <span className="dot" style={{ background: d.color, width: 8, height: 8 }} />
                  <span className="b f1" style={{ fontSize: 12.5 }}>{d.k}</span>
                  <span className="mono-sm muted">{d.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card-h" style={{ border: "none", padding: "0 0 12px" }}>
        <div className="tabs">
          <div className={"tab" + (tab === "sessions" ? " active" : "")} onClick={() => setTab("sessions")}>Active sessions</div>
          <div className={"tab" + (tab === "events" ? " active" : "")} onClick={() => setTab("events")}>Login history</div>
        </div>
        {tab === "sessions" && (
          <div className="chips mla">
            {[["all", "All"], ["high", "High risk"], ["medium", "Medium"], ["low", "Low"]].map(([k, l]) => <div key={k} className={"chip" + (risk === k ? " active" : "")} onClick={() => setRisk(k)}>{l}</div>)}
          </div>
        )}
      </div>

      {tab === "sessions" ? (
        <div className="card">
          <table className="tbl">
            <thead><tr><th>User</th><th>Source IP</th><th>Location</th><th>Device</th><th>Auth / MFA</th><th>Started</th><th className="tr">Risk</th><th></th></tr></thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} onClick={() => setSel(s)}>
                  <td>
                    <div className="flex ac g10">
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: s.kind === "admin" ? "var(--violet-soft)" : "var(--panel-3)", border: "1px solid " + (s.kind === "admin" ? "rgba(167,139,250,.3)" : "var(--line-2)"), display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: s.kind === "admin" ? "var(--violet)" : "var(--tx-2)", flex: "0 0 30px" }}>{s.user.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                      <div>
                        <div className="flex ac g6"><span className="b">{s.user}</span>{s.current && <span className="tag" style={{ fontSize: 9, color: "var(--acc)", borderColor: "var(--acc-line)" }}>THIS DEVICE</span>}{s.kind === "admin" && <span className="pill violet" style={{ fontSize: 9 }}>ADMIN</span>}</div>
                        <div className="mono-sm muted">{s.email} · {s.tenant}</div>
                      </div>
                    </div>
                  </td>
                  <td><div className="mono-sm b">{s.ip}</div><div className="mono-sm faint" style={{ color: s.ipType.includes("Tor") || s.ipType.includes("VPN") || s.ipType.includes("Datacenter") ? "var(--warn)" : "var(--tx-4)" }}>{s.ipType}</div></td>
                  <td><div className="flex ac g8"><span className="mono-sm" style={{ fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "var(--panel-3)", border: "1px solid var(--line-2)", color: "var(--tx-2)" }}>{s.cc}</span><div><div style={{ fontSize: 12.5 }}>{s.city}</div><div className="mono-sm faint">{s.country}</div></div></div></td>
                  <td><div className="flex ac g8"><Icon name={D_ICON[s.device]} size={15} style={{ color: "var(--tx-3)" }} /><div><div style={{ fontSize: 12.5 }}>{s.os}</div><div className="mono-sm faint">{s.browser}</div></div></div></td>
                  <td><div style={{ fontSize: 12 }}>{s.method}</div><div className="mono-sm" style={{ color: s.mfa === "None" ? "var(--crit)" : "var(--tx-3)" }}>{s.mfa}</div></td>
                  <td className="num muted" style={{ fontSize: 12 }}>{fmt.ago(s.started)} ago<div className="mono-sm faint">active {fmt.ago(s.last)} ago</div></td>
                  <td className="tr"><span className={"pill " + riskTone(s.risk)}><span className={"dot " + riskTone(s.risk) + (s.risk === "high" ? " live" : "")} />{s.risk}</span></td>
                  <td className="tr"><Icon name="chevron" size={15} style={{ color: "var(--tx-4)" }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="card-h"><Icon name="logs" size={15} style={{ color: "var(--acc)" }} /><h3>Authentication events</h3><span className="pill ok mla" style={{ fontSize: 10 }}><span className="dot ok live" />live</span></div>
          <table className="tbl">
            <thead><tr><th>Event</th><th>User</th><th>Source</th><th>Device</th><th>Detail</th><th className="tr">When</th></tr></thead>
            <tbody>
              {AUTH_EVENTS.map((e, i) => {
                const m = EVENT_META[e.type];
                return (
                  <tr key={i}>
                    <td><span className={"pill " + (m.tone === "idle" ? "" : m.tone)} style={{ fontSize: 10.5 }}><Icon name={m.icon} size={11} />{m.label}</span></td>
                    <td className="mono-sm">{e.user}</td>
                    <td><div className="mono-sm b">{e.ip}</div><div className="mono-sm faint">{e.loc}</div></td>
                    <td className="muted" style={{ fontSize: 12 }}>{e.device}</td>
                    <td className="muted" style={{ fontSize: 12, maxWidth: 300 }}><span style={{ color: m.tone === "crit" ? "var(--crit)" : "var(--tx-2)" }}>{e.detail}</span></td>
                    <td className="tr num muted">{fmt.ago(e.t)} ago</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sel && <SessionDrawer s={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function DonutMix({ data }: { data: { k: string; v: number; color: string }[] }) {
  let acc = 0;
  const stops = data.map((d) => { const from = acc; acc += d.v; return `${d.color} ${from}% ${acc}%`; }).join(",");
  return (
    <div style={{ width: 92, height: 92, borderRadius: "50%", background: `conic-gradient(${stops})`, position: "relative", flex: "0 0 92px" }}>
      <div style={{ position: "absolute", inset: "18%", borderRadius: "50%", background: "var(--panel)", display: "grid", placeItems: "center" }}>
        <div className="tc"><div className="mono b" style={{ fontSize: 15 }}>{data[0].v}%</div><div className="mono-sm faint" style={{ fontSize: 9 }}>desktop</div></div>
      </div>
    </div>
  );
}

function SessionDrawer({ s, onClose }: { s: Session; onClose: () => void }) {
  const tone = riskTone(s.risk);
  const timeline = [
    { t: fmt.ago(s.started) + " ago", e: "Session created", d: s.method, tone: "ok" },
    { t: fmt.ago(s.started) + " ago", e: "MFA satisfied", d: s.mfa, tone: s.mfa === "None" ? "crit" : "info" },
    ...(s.flags ? s.flags.map((f) => ({ t: "at login", e: "Risk signal", d: f, tone: "crit" })) : []),
    { t: fmt.ago(s.last) + " ago", e: "Last activity", d: "GET /v1/campaigns", tone: "idle" },
  ];
  return (
    <Drawer title={s.user} sub={s.id + " · " + s.email} onClose={onClose} actions={<button className="btn danger sm"><Icon name="x" size={13} />Revoke</button>}>
      <div style={{ padding: "13px 15px", borderRadius: "var(--r-sm)", marginBottom: 18, background: "var(--" + tone + "-soft)", border: "1px solid var(--" + tone + "-line)" }}>
        <div className="flex ac g8" style={{ color: "var(--" + tone + ")" }}>
          <Icon name={tone === "ok" ? "shield" : "alert"} size={16} />
          <b style={{ fontSize: 13.5, textTransform: "capitalize" }}>{s.risk} risk session</b>
          {s.current && <span className="tag mla" style={{ color: "var(--acc)" }}>current device</span>}
        </div>
        {s.flags ? <div className="flex g6 wrap" style={{ marginTop: 9 }}>{s.flags.map((f) => <span key={f} className="tag" style={{ color: "var(--crit)", borderColor: "var(--crit-line)", background: "var(--crit-soft)" }}>{f}</span>)}</div>
          : <div className="muted" style={{ fontSize: 12, marginTop: 5 }}>No anomalies — trusted device, known location, MFA satisfied.</div>}
      </div>

      <div className="dlabel">Identity</div>
      <div className="kvr"><span className="kk">User</span><span className="vv">{s.user}</span></div>
      <div className="kvr"><span className="kk">Email</span><span className="vv">{s.email}</span></div>
      <div className="kvr"><span className="kk">Tenant</span><span className="vv">{s.tenant}</span></div>
      <div className="kvr"><span className="kk">Role</span><span className="vv">{s.role}</span></div>

      <div className="dlabel" style={{ marginTop: 18 }}>Login source</div>
      <div className="kvr"><span className="kk">IP address</span><span className="vv">{s.ip}</span></div>
      <div className="kvr"><span className="kk">IP type</span><span className="vv" style={{ color: s.ipType.includes("Tor") || s.ipType.includes("VPN") || s.ipType.includes("Datacenter") ? "var(--warn)" : "var(--tx)" }}>{s.ipType}</span></div>
      <div className="kvr"><span className="kk">ISP / carrier</span><span className="vv">{s.isp}</span></div>
      <div className="kvr"><span className="kk">ASN</span><span className="vv">{s.asn}</span></div>

      <div className="dlabel" style={{ marginTop: 18 }}>Geolocation</div>
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 10 }}>
        <MiniMap coords={s.coords} tone={tone} />
        <div style={{ padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid var(--line)" }}>
          <span className="mono-sm" style={{ fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "var(--panel-3)", border: "1px solid var(--line-2)" }}>{s.cc}</span>
          <div className="f1"><div className="b" style={{ fontSize: 13 }}>{s.city}, {s.region}</div><div className="mono-sm faint">{s.country} · {s.coords}</div></div>
          <div className="tr"><div className="mono-sm muted">{s.tz}</div></div>
        </div>
      </div>

      <div className="dlabel" style={{ marginTop: 18 }}>Device fingerprint</div>
      <div className="flex ac g10" style={{ padding: "11px 13px", borderRadius: "var(--r-sm)", background: "var(--panel-2)", border: "1px solid var(--line)", marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--panel-3)", display: "grid", placeItems: "center", color: "var(--tx-2)", flex: "0 0 36px" }}><Icon name={D_ICON[s.device]} size={18} /></div>
        <div className="f1"><div className="b" style={{ fontSize: 13, textTransform: "capitalize" }}>{s.device} · {s.os}</div><div className="mono-sm faint">{s.browser} · {s.screen}</div></div>
        {s.trusted ? <span className="pill ok" style={{ fontSize: 10 }}><Icon name="check" size={11} />trusted</span> : <span className="pill warn" style={{ fontSize: 10 }}>new</span>}
      </div>
      <div className="kvr"><span className="kk">Fingerprint hash</span><span className="vv">{s.fp}</span></div>
      <div className="kvr"><span className="kk">Timezone</span><span className="vv">{s.tz}</span></div>

      <div className="dlabel" style={{ marginTop: 18 }}>Authentication</div>
      <div className="kvr"><span className="kk">Method</span><span className="vv">{s.method}</span></div>
      <div className="kvr"><span className="kk">MFA factor</span><span className="vv" style={{ color: s.mfa === "None" ? "var(--crit)" : "var(--ok)" }}>{s.mfa}</span></div>
      <div className="kvr"><span className="kk">Expires</span><span className="vv">{s.expires}</span></div>

      <div className="dlabel" style={{ marginTop: 18 }}>Session timeline</div>
      <div style={{ paddingLeft: 2 }}>
        {timeline.map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < timeline.length - 1 ? 13 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span className={"dot " + (x.tone === "idle" ? "" : x.tone)} style={{ width: 9, height: 9, marginTop: 5, background: x.tone === "idle" ? "var(--tx-4)" : undefined }} />
              {i < timeline.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 14, background: "var(--line-2)", marginTop: 3 }} />}
            </div>
            <div><div className="b" style={{ fontSize: 12.5 }}>{x.e}</div><div className="mono-sm faint">{x.t} · {x.d}</div></div>
          </div>
        ))}
      </div>

      <div className="flex g8" style={{ marginTop: 22 }}>
        <button className="btn f1"><Icon name="logs" size={14} />Full audit</button>
        <button className="btn danger f1"><Icon name="x" size={14} />Revoke session</button>
      </div>
    </Drawer>
  );
}

function MiniMap({ coords, tone }: { coords: string; tone: string }) {
  const [lat, lon] = coords.split(",").map((n) => parseFloat(n));
  const x = ((lon + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return (
    <div style={{ position: "relative", height: 120, background: "linear-gradient(180deg,#0c1014,#0a0d11)", overflow: "hidden" }}>
      <svg width="100%" height="120" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        {[...Array(11)].map((_, i) => <line key={"v" + i} x1={i * 10 + "%"} y1="0" x2={i * 10 + "%"} y2="120" stroke="var(--line)" strokeWidth="0.5" />)}
        {[...Array(7)].map((_, i) => <line key={"h" + i} x1="0" y1={i * 20} x2="100%" y2={i * 20} stroke="var(--line)" strokeWidth="0.5" />)}
      </svg>
      <div style={{ position: "absolute", left: x + "%", top: y + "%", transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--" + tone + ")", boxShadow: "0 0 0 4px var(--" + tone + "-soft),0 0 16px var(--" + tone + ")" }} />
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid var(--" + tone + "-line)", animation: "pulse 1.8s ease-in-out infinite" }} />
      </div>
      <div className="mono-sm faint" style={{ position: "absolute", left: 10, bottom: 8, fontSize: 10 }}>LAT/LON GEOLOCATION</div>
    </div>
  );
}
