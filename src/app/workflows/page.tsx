"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { Drawer, KPI, StatusPill } from "@/components/shell";
import { DLQ, PLATFORMS, WORKFLOWS, type Workflow, fmt } from "@/lib/ops";

export default function WorkflowsPage() {
  const [tab, setTab] = useState<"workflows" | "dlq">("workflows");
  const [sel, setSel] = useState<Workflow | null>(null);

  const running = WORKFLOWS.filter((w) => w.state === "running").length;

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Workflows &amp; Jobs</h2><div className="sub">Temporal durable executions · launch sagas, polls, creative jobs</div></div>
        <div className="tabs">
          <div className={"tab" + (tab === "workflows" ? " active" : "")} onClick={() => setTab("workflows")}>Workflows</div>
          <div className={"tab" + (tab === "dlq" ? " active" : "")} onClick={() => setTab("dlq")}>Dead-letter <span className="mono-sm" style={{ color: "var(--crit)" }}>· {DLQ.length}</span></div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 14 }}>
        <KPI label="Running" value={running.toString()} icon="play" />
        <KPI label="Completed 24h" value="1,182" delta={18} icon="check" />
        <KPI label="Failed 24h" value="22" delta={9} bad icon="x" />
        <KPI label="DLQ depth" value={DLQ.length.toString()} delta={4} bad icon="alert" />
      </div>

      {tab === "workflows" ? (
        <div className="card">
          <div className="card-h"><Icon name="flow" size={15} style={{ color: "var(--violet)" }} /><h3>Executions</h3><span className="k mla">temporal namespace: relay-prod</span></div>
          <table className="tbl">
            <thead><tr><th>Workflow ID</th><th>Tenant</th><th>Type</th><th>State</th><th>Progress</th><th className="tr">Attempt</th><th className="tr">Started</th></tr></thead>
            <tbody>
              {WORKFLOWS.map((w) => (
                <tr key={w.id} onClick={() => setSel(w)}>
                  <td className="mono b" style={{ fontSize: 12 }}>{w.id}</td>
                  <td className="muted">{w.tenant}</td>
                  <td><span className="tag">{w.type}</span></td>
                  <td><StatusPill status={w.state}>{w.state}</StatusPill></td>
                  <td style={{ width: 130 }}>
                    {w.total > 0 ? (
                      <div className="flex ac g8">
                        <div className="meter f1"><i className={w.state === "failed" ? "crit" : w.state === "terminated" ? "warn" : ""} style={{ width: (w.done / w.total * 100) + "%" }} /></div>
                        <span className="mono-sm faint">{w.done}/{w.total}</span>
                      </div>
                    ) : <span className="faint mono-sm">—</span>}
                  </td>
                  <td className="tr num" style={{ color: w.attempt > 1 ? "var(--warn)" : "var(--tx-2)" }}>{w.attempt}/5</td>
                  <td className="tr num muted">{fmt.ago(w.started)} ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="card-h"><Icon name="alert" size={15} style={{ color: "var(--crit)" }} /><h3>Dead-letter queue</h3>
            <button className="btn sm mla"><Icon name="retry" size={13} />Replay all</button></div>
          <table className="tbl">
            <thead><tr><th>Event ID</th><th>Topic</th><th>Tenant</th><th>Reason</th><th className="tr">Attempts</th><th className="tr">Age</th><th></th></tr></thead>
            <tbody>
              {DLQ.map((e) => (
                <tr key={e.id}>
                  <td className="mono b" style={{ fontSize: 12 }}>{e.id}</td>
                  <td><span className="tag">{e.topic}</span></td>
                  <td className="muted">{e.tenant}</td>
                  <td style={{ color: "var(--crit)", fontSize: 12.5 }}>{e.reason}</td>
                  <td className="tr num">{e.attempts}</td>
                  <td className="tr num muted">{e.age}</td>
                  <td className="tr"><button className="btn sm ghost"><Icon name="retry" size={12} />Replay</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sel && <WorkflowDrawer w={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

function WorkflowDrawer({ w, onClose }: { w: Workflow; onClose: () => void }) {
  const steps = [
    { name: "Pre-flight compliance", state: "done" },
    { name: "Build launch plan", state: "done" },
    ...w.platforms.map((p, i) => ({
      name: "Submit · " + (PLATFORMS[p]?.name || p),
      state: i < w.done ? "done" : w.state === "failed" && i === w.done ? "failed" : w.state === "running" && i === w.done ? "running" : "pending",
    })),
    { name: "Finalize & notify", state: w.state === "completed" ? "done" : "pending" },
  ];
  return (
    <Drawer title={w.id} sub={w.type + " · " + w.tenant} onClose={onClose} actions={w.state === "failed" ? <button className="btn sm"><Icon name="retry" size={13} />Retry</button> : null}>
      <div className="flex g8 wrap" style={{ marginBottom: 16 }}>
        <StatusPill status={w.state}>{w.state}</StatusPill>
        <span className="tag">attempt {w.attempt}/5</span>
        <span className="tag">started {fmt.ago(w.started)} ago</span>
      </div>

      {w.error && (
        <div style={{ marginBottom: 18, padding: "12px 14px", borderRadius: "var(--r-sm)", background: "var(--crit-soft)", border: "1px solid var(--crit-line)" }}>
          <div className="flex ac g8" style={{ color: "var(--crit)" }}><Icon name="alert" size={15} /><b style={{ fontSize: 13 }}>Failure</b></div>
          <div className="mono-sm" style={{ marginTop: 6, color: "var(--tx-2)" }}>{w.error}</div>
        </div>
      )}

      <div className="dlabel">Execution timeline</div>
      <div style={{ position: "relative", paddingLeft: 4 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: i < steps.length - 1 ? 14 : 0, position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", flex: "0 0 22px",
                background: s.state === "done" ? "var(--acc-soft)" : s.state === "failed" ? "var(--crit-soft)" : s.state === "running" ? "var(--info-soft)" : "var(--panel-3)",
                border: "1px solid " + (s.state === "done" ? "var(--acc-line)" : s.state === "failed" ? "var(--crit-line)" : s.state === "running" ? "var(--blue-line)" : "var(--line-2)"),
                color: s.state === "done" ? "var(--acc)" : s.state === "failed" ? "var(--crit)" : s.state === "running" ? "var(--blue)" : "var(--tx-4)" }}>
                {s.state === "done" ? <Icon name="check" size={12} /> : s.state === "failed" ? <Icon name="x" size={12} /> : s.state === "running" ? <span className="dot info live" /> : <span style={{ fontSize: 10 }} className="mono">{i + 1}</span>}
              </div>
              {i < steps.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 18, background: s.state === "done" ? "var(--acc-dim)" : "var(--line-2)", marginTop: 2 }} />}
            </div>
            <div style={{ paddingTop: 1 }}>
              <div className="b" style={{ fontSize: 13, color: s.state === "pending" ? "var(--tx-3)" : "var(--tx)" }}>{s.name}</div>
              <div className="mono-sm faint">{s.state === "done" ? "completed" : s.state === "running" ? "in progress…" : s.state === "failed" ? "failed — retrying" : "queued"}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dlabel" style={{ marginTop: 20 }}>Metadata</div>
      <div className="kvr"><span className="kk">Workflow ID</span><span className="vv">{w.id}</span></div>
      <div className="kvr"><span className="kk">Task queue</span><span className="vv">launch-workers</span></div>
      <div className="kvr"><span className="kk">Idempotency key</span><span className="vv">{w.id.split("-").pop()}</span></div>
    </Drawer>
  );
}
