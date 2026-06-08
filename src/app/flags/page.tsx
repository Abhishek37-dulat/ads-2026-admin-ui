"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

interface Flag { id: string; name: string; desc: string; on: boolean; rollout: number; env: string; }

const INITIAL: Flag[] = [
  { id: "ai_intent_v2", name: "AI Intent v2", desc: "New LLM intent parser with copy suggestions", on: true, rollout: 100, env: "prod" },
  { id: "auto_budget_split", name: "Auto budget split", desc: "Cross-platform budget optimization on launch", on: true, rollout: 62, env: "prod" },
  { id: "pinterest_adapter", name: "Pinterest adapter", desc: "Enable Pinterest as a launch target", on: true, rollout: 100, env: "prod" },
  { id: "reddit_adapter", name: "Reddit adapter", desc: "Beta Reddit Ads integration", on: false, rollout: 0, env: "staging" },
  { id: "realtime_metrics", name: "Realtime metric push", desc: "WebSocket live metric streaming to dashboards", on: true, rollout: 85, env: "prod" },
  { id: "creative_smartcrop", name: "Smart-crop derivatives", desc: "Saliency-based auto crop for all ratios", on: true, rollout: 48, env: "prod" },
  { id: "sox_audit_export", name: "Audit export API", desc: "Tenant-facing audit log export endpoint", on: false, rollout: 0, env: "dev" },
];

export default function FlagsPage() {
  const [flags, setFlags] = useState(INITIAL);
  const toggle = (id: string) => setFlags((f) => f.map((x) => (x.id === id ? { ...x, on: !x.on, rollout: !x.on ? 100 : 0 } : x)));

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Feature Flags</h2><div className="sub">Runtime configuration &amp; gradual rollout</div></div>
        <button className="btn acc sm"><Icon name="flag" size={14} />New flag</button>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Flag</th><th>Environment</th><th>Rollout</th><th className="tr">State</th></tr></thead>
          <tbody>
            {flags.map((f) => (
              <tr key={f.id} onClick={() => toggle(f.id)}>
                <td><div className="b">{f.name}</div><div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{f.desc}</div><div className="mono-sm faint" style={{ marginTop: 3 }}>{f.id}</div></td>
                <td><span className="tag">{f.env}</span></td>
                <td style={{ width: 180 }}>
                  <div className="flex ac g8"><div className="meter f1"><i className={f.rollout < 100 && f.rollout > 0 ? "warn" : ""} style={{ width: f.rollout + "%" }} /></div><span className="mono-sm" style={{ minWidth: 34 }}>{f.rollout}%</span></div>
                </td>
                <td className="tr">
                  <div style={{ display: "inline-flex", width: 38, height: 22, borderRadius: 99, background: f.on ? "var(--acc)" : "var(--panel-3)", border: "1px solid " + (f.on ? "var(--acc)" : "var(--line-2)"), position: "relative", transition: ".15s", cursor: "pointer" }}>
                    <span style={{ position: "absolute", top: 2, left: f.on ? 18 : 2, width: 16, height: 16, borderRadius: 99, background: f.on ? "#04120B" : "var(--tx-3)", transition: ".15s" }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
