"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Drawer, KPI, StatusPill } from "@/components/shell";
import { PLATFORMS, TENANTS, type Tenant, fmt } from "@/lib/ops";

const FILTERS: [string, string][] = [["all", "All"], ["active", "Active"], ["past_due", "Past due"], ["suspended", "Suspended"]];

export default function TenantsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState<Tenant | null>(null);

  const rows = TENANTS.filter((t) => {
    if (filter !== "all" && t.status !== filter) return false;
    if (q && !t.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const totMrr = TENANTS.reduce((a, t) => a + t.mrr, 0);
  const totSpend = TENANTS.reduce((a, t) => a + t.spend30, 0);
  const totWs = TENANTS.reduce((a, t) => a + t.workspaces, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Tenants</h2><div className="sub">Organizations on the platform · billing, usage &amp; access</div></div>
        <div className="flex g8"><button className="btn ghost sm"><Icon name="ext" size={14} />Export</button><button className="btn acc sm"><Icon name="tenants" size={14} />New tenant</button></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 14 }}>
        <KPI label="Organizations" value="248" delta={6} icon="tenants" />
        <KPI label="Workspaces" value={totWs.toString()} delta={9} icon="grid" />
        <KPI label="Platform MRR" value={fmt.money(totMrr)} delta={11} icon="bolt" />
        <KPI label="Managed spend 30d" value={fmt.money(totSpend)} delta={12} icon="pulse" />
      </div>

      <div className="card">
        <div className="card-h">
          <div className="searchbox" style={{ width: 240, background: "var(--panel-2)" }}>
            <Icon name="search" size={14} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter tenants…" style={{ background: "transparent", border: "none", outline: "none", color: "var(--tx)", fontSize: 12.5, width: "100%", fontFamily: "var(--sans)" }} />
          </div>
          <div className="chips mla">
            {FILTERS.map(([k, l]) => <div key={k} className={"chip" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>{l}</div>)}
          </div>
        </div>
        <table className="tbl">
          <thead><tr><th>Organization</th><th>Plan</th><th className="tr">WS</th><th className="tr">Seats</th><th className="tr">MRR</th><th className="tr">Spend 30d</th><th>Adapters</th><th className="tr">Health</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} onClick={() => setSel(t)}>
                <td>
                  <div className="flex ac g10">
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(140deg,var(--panel-3),var(--panel))", border: "1px solid var(--line-2)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "var(--tx-2)", flex: "0 0 30px" }}>{t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                    <div><div className="b">{t.name}</div><div className="mono-sm muted">{t.owner}</div></div>
                  </div>
                </td>
                <td><span className="tag">{t.plan}</span></td>
                <td className="tr num">{t.workspaces}</td>
                <td className="tr num">{t.seats}</td>
                <td className="tr num">{fmt.money(t.mrr)}</td>
                <td className="tr num">{fmt.money(t.spend30)}</td>
                <td>
                  <div className="flex g6">{t.adapters.slice(0, 4).map((p) => {
                    const pl = PLATFORMS[p];
                    return <span key={p} title={pl?.name} style={{ width: 18, height: 18, borderRadius: 5, background: "var(--panel-3)", border: "1px solid var(--line-2)", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700, color: "var(--tx-2)" }}>{pl?.glyph || p[0].toUpperCase()}</span>;
                  })}{t.adapters.length > 4 && <span className="mono-sm faint" style={{ alignSelf: "center" }}>+{t.adapters.length - 4}</span>}</div>
                </td>
                <td className="tr">
                  <div className="flex ac g8" style={{ justifyContent: "flex-end" }}>
                    <div className="meter" style={{ width: 42 }}><i className={t.health < 70 ? "crit" : t.health < 88 ? "warn" : ""} style={{ width: t.health + "%" }} /></div>
                    <span className="num" style={{ fontSize: 12, color: t.health < 70 ? "var(--crit)" : t.health < 88 ? "var(--warn)" : "var(--ok)" }}>{t.health}</span>
                  </div>
                </td>
                <td><StatusPill status={t.status}>{t.status.replace("_", " ")}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel && <TenantDrawer t={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function TenantDrawer({ t, onClose }: { t: Tenant; onClose: () => void }) {
  return (
    <Drawer title={t.name} sub={t.id + " · since " + t.since} onClose={onClose} actions={<button className="btn sm"><Icon name="user" size={13} />Impersonate</button>}>
      <div className="flex g8 wrap" style={{ marginBottom: 16 }}>
        <StatusPill status={t.status}>{t.status.replace("_", " ")}</StatusPill>
        <span className="tag">{t.plan} plan</span>
        <span className="tag">{t.seats} seats</span>
        <span className="tag">{t.workspaces} workspaces</span>
      </div>

      <div className="dlabel">Billing &amp; usage</div>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 18 }}>
        <div className="kpi" style={{ padding: "12px 13px" }}><div className="kl">MRR</div><div className="kv" style={{ fontSize: 22 }}>{fmt.money(t.mrr)}</div></div>
        <div className="kpi" style={{ padding: "12px 13px" }}><div className="kl">Managed spend 30d</div><div className="kv" style={{ fontSize: 22 }}>{fmt.money(t.spend30)}</div></div>
      </div>

      <div className="dlabel">Account health</div>
      <div className="flex ac g10" style={{ marginBottom: 18 }}>
        <div className="meter f1" style={{ height: 7 }}><i className={t.health < 70 ? "crit" : t.health < 88 ? "warn" : ""} style={{ width: t.health + "%" }} /></div>
        <span className="num b" style={{ color: t.health < 70 ? "var(--crit)" : t.health < 88 ? "var(--warn)" : "var(--ok)" }}>{t.health}/100</span>
      </div>

      <div className="dlabel">Connected adapters</div>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
        {t.adapters.map((p) => {
          const pl = PLATFORMS[p];
          return (
            <div key={p} className="flex ac g8" style={{ padding: "9px 11px", borderRadius: "var(--r-sm)", background: "var(--panel-2)", border: "1px solid var(--line)" }}>
              <span style={{ width: 20, height: 20, borderRadius: 5, background: "var(--panel-3)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700, color: "var(--tx-2)" }}>{pl?.glyph || p[0]}</span>
              <span className="b" style={{ fontSize: 12.5 }}>{pl?.name || p}</span>
              <span className="dot ok mla" />
            </div>
          );
        })}
      </div>

      <div className="dlabel">Owner &amp; access</div>
      <div className="kvr"><span className="kk">Primary owner</span><span className="vv">{t.owner}</span></div>
      <div className="kvr"><span className="kk">Tenant ID</span><span className="vv">{t.id}</span></div>
      <div className="kvr"><span className="kk">Member since</span><span className="vv">{t.since}</span></div>
      <div className="kvr"><span className="kk">Data region</span><span className="vv">us-east-1</span></div>

      <div className="flex g8" style={{ marginTop: 20 }}>
        <button className="btn f1"><Icon name="logs" size={14} />Audit log</button>
        {t.status === "suspended"
          ? <button className="btn acc f1"><Icon name="play" size={14} />Reactivate</button>
          : <button className="btn danger f1"><Icon name="pause" size={14} />Suspend</button>}
      </div>
    </Drawer>
  );
}
