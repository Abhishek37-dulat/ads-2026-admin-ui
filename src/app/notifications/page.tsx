"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Drawer, KPI, StatusPill } from "@/components/shell";
import { MAIL_STREAM, MAIL_TEMPLATES, fmt } from "@/lib/ops";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-2)", border: "1px solid var(--line-2)", borderRadius: "var(--r-sm)",
  padding: "10px 13px", color: "var(--tx)", fontSize: 13, outline: "none", marginBottom: 10, fontFamily: "var(--sans)",
};
const TABS: [string, string][] = [["stream", "Delivery stream"], ["templates", "Templates"], ["broadcast", "Broadcasts"]];

export default function NotificationsPage() {
  const [tab, setTab] = useState("stream");
  const [compose, setCompose] = useState(false);
  const sent = MAIL_TEMPLATES.reduce((a, t) => a + t.sent30, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Notifications</h2><div className="sub">Transactional email, alerts &amp; tenant broadcasts</div></div>
        <div className="flex g8">
          <div className="tabs">{TABS.map(([k, l]) => <div key={k} className={"tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>{l}</div>)}</div>
          <button className="btn acc sm" onClick={() => setCompose(true)}><Icon name="send" size={14} />Compose</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 14 }}>
        <KPI label="Sent 30d" value={fmt.num(sent)} delta={4} icon="mail" />
        <KPI label="Delivery rate" value="99.2%" delta={0.1} icon="check" />
        <KPI label="Avg open rate" value="58.4%" delta={2.1} icon="eye" />
        <KPI label="Bounces 24h" value="14" delta={6} bad icon="x" />
      </div>

      {tab === "stream" && (
        <div className="card">
          <div className="card-h"><Icon name="mail" size={15} style={{ color: "var(--acc)" }} /><h3>Delivery stream</h3><span className="pill ok mla" style={{ fontSize: 10 }}><span className="dot ok live" />live</span></div>
          <table className="tbl">
            <thead><tr><th>Message</th><th>Recipient</th><th>Template</th><th>Status</th><th className="tr">Opened</th><th className="tr">Sent</th></tr></thead>
            <tbody>
              {MAIL_STREAM.map((m) => (
                <tr key={m.id}>
                  <td><div className="b" style={{ fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 280 }}>{m.subject}</div><div className="mono-sm faint">{m.id}</div></td>
                  <td className="mono-sm muted">{m.to}</td>
                  <td><span className="tag">{m.template}</span></td>
                  <td><StatusPill status={m.status}>{m.status}</StatusPill></td>
                  <td className="tr">{m.opened ? <Icon name="eye" size={15} style={{ color: "var(--ok)" }} /> : <span className="faint">—</span>}</td>
                  <td className="tr num muted">{fmt.ago(m.t)} ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "templates" && (
        <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {MAIL_TEMPLATES.map((t) => (
            <div key={t.id} className="card">
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "var(--panel-3)", border: "1px solid var(--line-2)", display: "grid", placeItems: "center", color: "var(--acc)", flex: "0 0 38px" }}><Icon name="mail" size={17} /></div>
                <div className="f1">
                  <div className="flex ac g8"><span className="b" style={{ fontSize: 13.5 }}>{t.name}</span><span className="tag" style={{ fontSize: 9.5 }}>{t.cat}</span></div>
                  <div className="mono-sm muted" style={{ marginTop: 3 }}>{t.id}</div>
                </div>
                <Icon name="chevron" size={16} style={{ color: "var(--tx-4)" }} />
              </div>
              <div style={{ display: "flex", borderTop: "1px solid var(--line)" }}>
                <div className="f1 tc" style={{ padding: "10px", borderRight: "1px solid var(--line)" }}><div className="kl" style={{ fontSize: 9.5 }}>SENT 30D</div><div className="mono b" style={{ fontSize: 15, marginTop: 3 }}>{fmt.num(t.sent30)}</div></div>
                <div className="f1 tc" style={{ padding: "10px", borderRight: "1px solid var(--line)" }}><div className="kl" style={{ fontSize: 9.5 }}>OPEN</div><div className="mono b" style={{ fontSize: 15, marginTop: 3, color: "var(--ok)" }}>{t.open}%</div></div>
                <div className="f1 tc" style={{ padding: "10px" }}><div className="kl" style={{ fontSize: 9.5 }}>CTR</div><div className="mono b" style={{ fontSize: 15, marginTop: 3 }}>{t.ctr}%</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "broadcast" && (
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="card-h"><Icon name="send" size={15} style={{ color: "var(--acc)" }} /><h3>New broadcast</h3></div>
          <div className="card-b">
            <div className="dlabel">Subject</div>
            <input placeholder="e.g. Scheduled maintenance — Sunday 02:00 UTC" style={inputStyle} />
            <div className="dlabel" style={{ marginTop: 16 }}>Body</div>
            <textarea rows={6} placeholder="Compose your tenant-wide announcement…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            <div className="flex g8 ac" style={{ marginTop: 16 }}>
              <span className="chip active"><Icon name="tenants" size={13} />All tenants · 248</span>
              <span className="chip"><Icon name="mail" size={13} />Email</span>
              <button className="btn acc mla"><Icon name="send" size={14} />Send broadcast</button>
            </div>
          </div>
        </div>
      )}

      {compose && <ComposeDrawer onClose={() => setCompose(false)} />}
    </div>
  );
}

function ComposeDrawer({ onClose }: { onClose: () => void }) {
  const [aud, setAud] = useState("all");
  const auds: [string, string][] = [["all", "All tenants · 248"], ["plan", "By plan tier"], ["health", "At-risk (health < 70)"], ["adapter", "By connected adapter"]];
  const counts: Record<string, number> = { all: 248, plan: 62, health: 8, adapter: 140 };
  return (
    <Drawer title="Compose broadcast" sub="System-wide tenant notification" onClose={onClose} actions={<button className="btn acc sm"><Icon name="send" size={13} />Send</button>}>
      <div className="dlabel">Audience</div>
      <div className="grid" style={{ gap: 8, marginBottom: 18 }}>
        {auds.map(([k, l]) => (
          <div key={k} onClick={() => setAud(k)} className="flex ac g10" style={{ padding: "11px 13px", borderRadius: "var(--r-sm)", cursor: "pointer", background: aud === k ? "var(--acc-soft)" : "var(--panel-2)", border: "1px solid " + (aud === k ? "var(--acc-line)" : "var(--line)") }}>
            <span className="dot" style={{ background: aud === k ? "var(--acc)" : "var(--tx-4)", boxShadow: aud === k ? "0 0 7px var(--acc)" : "none" }} />
            <span className="b f1" style={{ fontSize: 13 }}>{l}</span>
            <span className="mono-sm" style={{ color: aud === k ? "var(--acc)" : "var(--tx-3)" }}>{counts[k]}</span>
          </div>
        ))}
      </div>

      <div className="dlabel">Channel</div>
      <div className="flex g8" style={{ marginBottom: 18 }}>
        <span className="chip active"><Icon name="mail" size={13} />Email</span>
        <span className="chip"><Icon name="bell" size={13} />In-app</span>
        <span className="chip"><Icon name="bolt" size={13} />Both</span>
      </div>

      <div className="dlabel">Message</div>
      <input placeholder="Subject line" style={inputStyle} />
      <textarea placeholder="Write your announcement… Supports {{tenant.name}} variables." rows={6} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />

      <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: "var(--r-sm)", background: "var(--info-soft)", border: "1px solid var(--blue-line)" }}>
        <div className="flex ac g8" style={{ color: "var(--blue)" }}><Icon name="clock" size={14} /><b style={{ fontSize: 12.5 }}>Scheduled delivery available</b></div>
        <div className="muted" style={{ fontSize: 12, marginTop: 5 }}>Sends are throttled to 5k/min and respect tenant notification preferences &amp; quiet hours.</div>
      </div>
    </Drawer>
  );
}
