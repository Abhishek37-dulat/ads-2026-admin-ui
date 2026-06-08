"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Drawer, KPI, Spark, StatusPill } from "@/components/shell";
import { ADAPTERS, PLATFORMS, type PlatformMeta, fmt } from "@/lib/ops";

type Adapter = (typeof ADAPTERS)[number];

export default function AdaptersPage() {
  const [sel, setSel] = useState<{ d: Adapter; pl: PlatformMeta } | null>(null);
  const totCalls = ADAPTERS.reduce((a, d) => a + d.calls24, 0);
  const totRej = ADAPTERS.reduce((a, d) => a + d.rejects, 0);
  const avgSucc = (ADAPTERS.reduce((a, d) => a + d.success, 0) / ADAPTERS.length).toFixed(1);

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Adapter Fleet</h2><div className="sub">Cross-tenant platform integration health · last 24h</div></div>
        <div className="flex g8"><span className="pill warn"><span className="dot warn live" />2 degraded</span><span className="pill crit"><span className="dot crit" />1 critical</span></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 14 }}>
        <KPI label="Adapter calls 24h" value={fmt.num(totCalls)} delta={9} icon="plug" />
        <KPI label="Avg success rate" value={avgSucc + "%"} delta={-0.3} bad icon="check" />
        <KPI label="Rejections 24h" value={totRej.toLocaleString()} delta={14} bad icon="x" />
        <KPI label="Tokens expiring 7d" value="33" delta={0} icon="shield" />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        {ADAPTERS.map((d) => {
          const pl = PLATFORMS[d.id] ?? { name: d.id, glyph: d.id[0], id: d.id, color: "#999" };
          return (
            <div key={d.id} className="card" style={{ cursor: "pointer" }} onClick={() => setSel({ d, pl })}>
              <div className="card-h" style={{ padding: "12px 14px" }}>
                <span style={{ width: 26, height: 26, borderRadius: 6, background: "var(--panel-3)", border: "1px solid var(--line-2)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "var(--tx)" }}>{pl.glyph || pl.name[0]}</span>
                <h3 style={{ fontSize: 13.5 }}>{pl.name}</h3>
                <span className="mla"><span className={"dot " + (d.status === "ok" ? "ok" : d.status === "warn" ? "warn live" : "crit live")} /></span>
              </div>
              <div className="card-b" style={{ padding: 14 }}>
                <div className="flex jb" style={{ marginBottom: 10 }}>
                  <div><div className="kl" style={{ fontSize: 10 }}>SUCCESS</div><div className="mono b" style={{ fontSize: 19, color: d.success < 95 ? "var(--warn)" : "var(--ok)" }}>{d.success}%</div></div>
                  <div className="tr"><div className="kl" style={{ fontSize: 10 }}>CALLS 24H</div><div className="mono b" style={{ fontSize: 19 }}>{fmt.num(d.calls24)}</div></div>
                </div>
                <div className="meter" style={{ marginBottom: 12 }}><i className={d.success < 92 ? "crit" : d.success < 97 ? "warn" : ""} style={{ width: d.success + "%" }} /></div>
                <div className="flex jb mono-sm muted"><span>p95 {d.p95}ms</span><span style={{ color: d.rejects > 1000 ? "var(--crit)" : d.rejects > 400 ? "var(--warn)" : "inherit" }}>{d.rejects} rejects</span></div>
                <div className="flex ac g8" style={{ marginTop: 11, paddingTop: 11, borderTop: "1px solid var(--line)" }}>
                  <Icon name="shield" size={13} style={{ color: "var(--tx-3)" }} />
                  <span className="mono-sm muted f1" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.tokens}</span>
                </div>
                <div className="flex ac g8" style={{ marginTop: 9 }}>
                  <span className="kl" style={{ fontSize: 10 }}>QUOTA</span>
                  <div className="meter f1"><i className={d.quota > 85 ? "crit" : d.quota > 70 ? "warn" : ""} style={{ width: d.quota + "%" }} /></div>
                  <span className="mono-sm" style={{ color: d.quota > 85 ? "var(--crit)" : "var(--tx-2)" }}>{d.quota}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sel && <AdapterDrawer d={sel.d} pl={sel.pl} onClose={() => setSel(null)} />}
    </div>
  );
}

function AdapterDrawer({ d, pl, onClose }: { d: Adapter; pl: PlatformMeta; onClose: () => void }) {
  const series = Array.from({ length: 24 }, () => Math.round((d.calls24 / 24) * (0.6 + Math.random() * 0.8)));
  return (
    <Drawer title={pl.name + " Adapter"} sub={"platform=" + d.id + " · " + d.status} onClose={onClose} actions={<button className="btn sm"><Icon name="refresh" size={13} />Re-sync</button>}>
      <div className="flex g8 wrap" style={{ marginBottom: 16 }}>
        <StatusPill status={d.status}>{d.status === "ok" ? "healthy" : d.status}</StatusPill>
        <span className="tag">success {d.success}%</span>
        <span className="tag">p95 {d.p95}ms</span>
      </div>

      <div className="dlabel">Call volume (24h)</div>
      <div className="card" style={{ marginBottom: 18, padding: "14px 12px 6px" }}>
        <Spark data={series} color="var(--acc)" w={460} h={70} />
        <div className="flex jb mono-sm muted" style={{ marginTop: 6, padding: "0 4px" }}><span>24h ago</span><span>now</span></div>
      </div>

      <div className="dlabel">Health checks</div>
      <div className="kvr"><span className="kk">Calls 24h</span><span className="vv">{d.calls24.toLocaleString()}</span></div>
      <div className="kvr"><span className="kk">Success rate</span><span className="vv" style={{ color: d.success < 95 ? "var(--warn)" : "var(--ok)" }}>{d.success}%</span></div>
      <div className="kvr"><span className="kk">Rejections</span><span className="vv" style={{ color: d.rejects > 1000 ? "var(--crit)" : "inherit" }}>{d.rejects}</span></div>
      <div className="kvr"><span className="kk">p95 latency</span><span className="vv">{d.p95}ms</span></div>
      <div className="kvr"><span className="kk">Rate-limit usage</span><span className="vv" style={{ color: d.quota > 85 ? "var(--crit)" : "inherit" }}>{d.quota}%</span></div>
      <div className="kvr"><span className="kk">OAuth tokens</span><span className="vv">{d.tokens}</span></div>
      <div className="kvr"><span className="kk">Rule pack</span><span className="vv">2026-05</span></div>

      {d.status !== "ok" && (
        <div style={{ marginTop: 18, padding: "12px 14px", borderRadius: "var(--r-sm)", background: "var(--warn-soft)", border: "1px solid var(--warn-line)" }}>
          <div className="flex ac g8" style={{ color: "var(--warn)" }}><Icon name="alert" size={15} /><b style={{ fontSize: 13 }}>Attention required</b></div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>{d.id === "x" ? "8 connections returning INVALID_CREDS — OAuth app re-review likely needed." : "Reject rate above baseline — check rule pack drift on creative validation."}</div>
        </div>
      )}

      <div className="flex g8" style={{ marginTop: 20 }}>
        <button className="btn f1"><Icon name="logs" size={14} />View logs</button>
        <button className="btn f1"><Icon name="shield" size={14} />Token health</button>
      </div>
    </Drawer>
  );
}
