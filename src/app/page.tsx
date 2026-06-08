"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { KPI, StatusPill } from "@/components/shell";
import { INFRA, LOG_SEED, type LogLine, nextLog, OVERVIEW, SERVICES, WORKFLOWS, fmt } from "@/lib/ops";

const TILES: [string, string, keyof typeof OVERVIEW][] = [
  ["Active tenants", "tenants", "tenants"],
  ["Launches 24h", "bolt", "launches"],
  ["API calls 24h", "pulse", "apiCalls"],
  ["Error rate", "alert", "errRate"],
  ["Ad spend MTD", "grid", "spendMTD"],
  ["Emails sent 24h", "mail", "mailSent"],
];

export default function MissionControl() {
  const [logs, setLogs] = useState<LogLine[]>(LOG_SEED.slice());
  useEffect(() => {
    const id = setInterval(() => setLogs((prev) => [nextLog(), ...prev].slice(0, 7)), 2200);
    return () => clearInterval(id);
  }, []);

  const okCount = SERVICES.filter((s) => s.status === "ok").length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Mission Control</h2>
          <div className="sub">Platform-wide health across all tenants · refreshed live</div>
        </div>
        <div className="flex g8 ac">
          <span className="pill ok"><span className="dot ok live" />{okCount}/{SERVICES.length} services healthy</span>
          <span className="pill crit"><span className="dot crit live" />1 incident</span>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(6,1fr)", marginBottom: 14 }}>
        {TILES.map(([label, icon, key]) => {
          const d = OVERVIEW[key];
          return <KPI key={label} label={label} value={d.v} delta={d.d} series={d.series} bad={d.bad} icon={icon} />;
        })}
      </div>

      <div className="row" style={{ alignItems: "stretch" }}>
        <div className="card f1" style={{ flex: "1.4" }}>
          <div className="card-h"><Icon name="cpu" size={15} style={{ color: "var(--acc)" }} /><h3>Service Health</h3><span className="k mla">core services</span></div>
          <div style={{ padding: "4px 0" }}>
            <table className="tbl">
              <thead><tr><th>Service</th><th>Status</th><th className="tr">RPS</th><th className="tr">p95</th><th className="tr">Err%</th><th className="tr">CPU</th><th className="tr">Inst</th></tr></thead>
              <tbody>
                {SERVICES.map((s) => (
                  <tr key={s.id}>
                    <td><div className="b">{s.name}</div>{s.note && <div className="mono-sm" style={{ color: "var(--crit)", marginTop: 2 }}>{s.note}</div>}</td>
                    <td><StatusPill status={s.status}>{s.status === "ok" ? "healthy" : s.status}</StatusPill></td>
                    <td className="tr num">{s.rps.toLocaleString()}</td>
                    <td className="tr num" style={{ color: s.p95 > 250 ? "var(--warn)" : "var(--tx-2)" }}>{s.p95}ms</td>
                    <td className="tr num" style={{ color: s.err > 5 ? "var(--crit)" : s.err > 0.5 ? "var(--warn)" : "var(--tx-2)" }}>{s.err}</td>
                    <td className="tr" style={{ width: 84 }}>
                      <div className="flex ac g8"><div className="meter f1"><i className={s.cpu > 70 ? "warn" : ""} style={{ width: s.cpu + "%" }} /></div><span className="num faint" style={{ fontSize: 11 }}>{s.cpu}</span></div>
                    </td>
                    <td className="tr num muted">{s.inst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ flex: ".85" }}>
          <div className="card-h"><Icon name="db" size={15} style={{ color: "var(--blue)" }} /><h3>Infrastructure</h3></div>
          <div className="card-b" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {INFRA.map((d) => (
              <div key={d.id} className="flex ac g10" style={{ padding: "8px 10px", borderRadius: "var(--r-sm)", background: "var(--panel-2)", border: "1px solid var(--line)" }}>
                <span className={"dot " + (d.status === "ok" ? "ok" : d.status === "warn" ? "warn" : "crit") + (d.status !== "ok" ? " live" : "")} />
                <div className="f1" style={{ minWidth: 0 }}>
                  <div className="b" style={{ fontSize: 13 }}>{d.name}</div>
                  <div className="mono-sm muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.sub}</div>
                </div>
                <div className="mono-sm tr" style={{ color: d.status === "warn" ? "var(--warn)" : "var(--tx-2)", whiteSpace: "nowrap" }}>{d.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 14, alignItems: "stretch" }}>
        <div className="card f1">
          <div className="card-h"><Icon name="logs" size={15} style={{ color: "var(--acc)" }} /><h3>Live Log Stream</h3>
            <span className="pill ok mla" style={{ fontSize: 10 }}><span className="dot ok live" />tailing</span></div>
          <div style={{ padding: "6px 0" }}>
            {logs.map((l, i) => (
              <div className="logline" key={i} style={i === 0 ? { animation: "fadeup .3s" } : undefined}>
                <span className="lt">{fmt.time(l.t)}</span>
                <span className={"lvl " + l.lvl}>{l.lvl}</span>
                <span className="lsvc">{l.svc}</span>
                <span className="lmsg">{l.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ flex: ".7" }}>
          <div className="card-h"><Icon name="flow" size={15} style={{ color: "var(--violet)" }} /><h3>Active Workflows</h3></div>
          <div className="card-b" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {WORKFLOWS.filter((w) => w.state === "running").map((w) => (
              <div key={w.id} style={{ padding: "10px 11px", borderRadius: "var(--r-sm)", background: "var(--panel-2)", border: "1px solid var(--line)" }}>
                <div className="flex ac g8">
                  <span className="dot info live" />
                  <span className="mono-sm b f1" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.id}</span>
                  <span className="mono-sm faint">{w.done}/{w.total}</span>
                </div>
                <div className="flex ac jb" style={{ marginTop: 6 }}>
                  <span className="muted" style={{ fontSize: 12 }}>{w.tenant}</span>
                  <span className="tag">{w.type}</span>
                </div>
                <div className="meter" style={{ marginTop: 8 }}><i style={{ width: (w.done / w.total * 100) + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
