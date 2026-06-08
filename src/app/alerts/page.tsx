"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Drawer, KPI, StatusPill } from "@/components/shell";
import { ALERTS, type Alert, fmt } from "@/lib/ops";

const FILTERS: [string, string][] = [["all", "All"], ["firing", "Firing"], ["acked", "Acked"], ["resolved", "Resolved"]];
const SEV_COLOR: Record<string, string> = { critical: "crit", warning: "warn", info: "info" };

export default function AlertsPage() {
  const [sel, setSel] = useState<Alert | null>(null);
  const [filter, setFilter] = useState("all");

  const rows = ALERTS.filter((a) => filter === "all" || a.state === filter);
  const firing = ALERTS.filter((a) => a.state === "firing");
  const crit = firing.filter((a) => a.sev === "critical").length;

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Alerts &amp; Incidents</h2><div className="sub">Active monitors, severity &amp; on-call response</div></div>
        <div className="flex g8"><button className="btn ghost sm"><Icon name="gear" size={14} />Alert rules</button><button className="btn sm"><Icon name="bell" size={14} />Silence all</button></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 14 }}>
        <KPI label="Firing" value={firing.length.toString()} icon="bell" />
        <KPI label="Critical" value={crit.toString()} icon="alert" />
        <KPI label="MTTA (24h)" value="3.4m" delta={-12} icon="clock" />
        <KPI label="MTTR (24h)" value="22m" delta={-8} icon="check" />
      </div>

      <div className="card-h" style={{ border: "none", padding: "0 0 12px" }}>
        <div className="chips">{FILTERS.map(([k, l]) => <div key={k} className={"chip" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>{l}</div>)}</div>
      </div>

      <div className="grid" style={{ gap: 10 }}>
        {rows.map((a) => {
          const c = SEV_COLOR[a.sev];
          return (
            <div key={a.id} className="card" style={{ cursor: "pointer", borderLeft: "3px solid var(--" + c + ")" }} onClick={() => setSel(a)}>
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <span className={"dot " + c + (a.state === "firing" ? " live" : "")} style={{ width: 9, height: 9, flex: "0 0 9px" }} />
                <div className="f1" style={{ minWidth: 0 }}>
                  <div className="flex ac g8">
                    <span className="b" style={{ fontSize: 14 }}>{a.title}</span>
                    <span className={"pill " + c} style={{ fontSize: 10 }}>{a.sev}</span>
                    {a.ack && <span className="tag" style={{ fontSize: 9.5 }}>ACKED</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.desc}</div>
                </div>
                <div className="tr" style={{ flex: "0 0 auto" }}>
                  <div className="mono-sm" style={{ color: "var(--" + c + ")" }}>{a.id}</div>
                  <div className="mono-sm faint" style={{ marginTop: 2 }}>{a.svc} · {fmt.ago(a.since)} ago</div>
                </div>
                <StatusPill status={a.state}>{a.state}</StatusPill>
              </div>
            </div>
          );
        })}
      </div>

      {sel && <AlertDrawer a={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function AlertDrawer({ a, onClose }: { a: Alert; onClose: () => void }) {
  const c = SEV_COLOR[a.sev];
  const timeline = [
    { t: fmt.ago(a.since) + " ago", e: "Alert fired", d: a.rule, state: "crit" },
    { t: a.ack ? fmt.ago(new Date(a.since.getTime() + 180000)) + " ago" : null, e: "Acknowledged", d: "ops@relay.io", state: "info" },
    { t: a.state === "resolved" ? "just now" : null, e: "Resolved", d: "auto-resolved", state: "ok" },
  ].filter((x) => x.t);
  return (
    <Drawer title={a.title} sub={a.id + " · " + a.svc} onClose={onClose} actions={a.state === "firing" ? <button className="btn sm acc"><Icon name="check" size={13} />{a.ack ? "Resolve" : "Ack"}</button> : null}>
      <div className="flex g8 wrap" style={{ marginBottom: 16 }}>
        <span className={"pill " + c}><span className={"dot " + c + (a.state === "firing" ? " live" : "")} />{a.sev}</span>
        <StatusPill status={a.state}>{a.state}</StatusPill>
        <span className="tag">{a.svc}</span>
      </div>

      <div style={{ padding: "13px 15px", borderRadius: "var(--r-sm)", background: "var(--" + c + "-soft)", border: "1px solid var(--" + c + "-line)", marginBottom: 18 }}>
        <div className="b" style={{ fontSize: 13, color: "var(--" + c + ")", marginBottom: 5 }}>Description</div>
        <div style={{ fontSize: 13, color: "var(--tx-2)", lineHeight: 1.55 }}>{a.desc}</div>
      </div>

      <div className="dlabel">Trigger condition</div>
      <div className="card mono-sm" style={{ padding: "12px 14px", marginBottom: 18, color: "var(--acc)", background: "var(--bg-2)" }}>{a.rule}</div>

      <div className="dlabel">Incident timeline</div>
      <div style={{ paddingLeft: 2 }}>
        {timeline.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < timeline.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span className={"dot " + s.state} style={{ width: 10, height: 10, marginTop: 4 }} />
              {i < timeline.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 16, background: "var(--line-2)", marginTop: 4 }} />}
            </div>
            <div><div className="b" style={{ fontSize: 13 }}>{s.e}</div><div className="mono-sm faint">{s.t} · {s.d}</div></div>
          </div>
        ))}
      </div>

      <div className="flex g8" style={{ marginTop: 22 }}>
        <button className="btn f1"><Icon name="logs" size={14} />Related logs</button>
        <button className="btn f1"><Icon name="user" size={14} />Page on-call</button>
      </div>
    </Drawer>
  );
}
