"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { LOG_SEED, type LogLine, nextLog, fmt } from "@/lib/ops";

const LEVELS: [string, string][] = [["all", "All"], ["INFO", "Info"], ["WARN", "Warn"], ["ERROR", "Error"], ["AUDIT", "Audit"], ["DEBUG", "Debug"]];

export default function LogsPage() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [paused, setPaused] = useState(false);
  const [lvl, setLvl] = useState("all");
  const [q, setQ] = useState("");
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const seed = LOG_SEED.slice();
    for (let i = 0; i < 26; i++) seed.push(nextLog());
    setLogs(seed.sort((a, b) => b.t.getTime() - a.t.getTime()));
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setLogs((prev) => [nextLog(), ...prev].slice(0, 120));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const counts = { INFO: 0, WARN: 0, ERROR: 0, AUDIT: 0, DEBUG: 0 } as Record<string, number>;
  logs.forEach((l) => { if (counts[l.lvl] !== undefined) counts[l.lvl]++; });

  const shown = logs.filter((l) => {
    if (lvl !== "all" && l.lvl !== lvl) return false;
    if (q && !(l.msg.toLowerCase().includes(q.toLowerCase()) || l.svc.includes(q.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-head">
        <div><h2>Logs &amp; Audit</h2><div className="sub">Unified structured log stream across all services</div></div>
        <div className="flex g8 ac">
          <span className="pill crit" style={{ fontSize: 10.5 }}>{counts.ERROR} err</span>
          <span className="pill warn" style={{ fontSize: 10.5 }}>{counts.WARN} warn</span>
          <span className="pill violet" style={{ fontSize: 10.5 }}>{counts.AUDIT} audit</span>
          <button className={"btn sm" + (paused ? " acc" : "")} onClick={() => setPaused(!paused)}>
            <Icon name={paused ? "play" : "pause"} size={13} />{paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <div className="searchbox" style={{ width: 260, background: "var(--panel-2)" }}>
            <Icon name="search" size={14} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="grep messages & services…" style={{ background: "transparent", border: "none", outline: "none", color: "var(--tx)", fontSize: 12, width: "100%", fontFamily: "var(--mono)" }} />
          </div>
          <div className="chips mla">
            {LEVELS.map(([k, l]) => <div key={k} className={"chip" + (lvl === k ? " active" : "")} onClick={() => setLvl(k)}>{l}</div>)}
          </div>
          <span className="pill ok" style={{ fontSize: 10 }}><span className={"dot ok" + (paused ? "" : " live")} />{paused ? "paused" : "tailing"}</span>
        </div>

        <div className="logline" style={{ borderBottom: "1px solid var(--line-2)", background: "var(--bg-2)" }}>
          <span className="lt faint" style={{ fontSize: 9, letterSpacing: ".1em" }}>TIME</span>
          <span className="faint" style={{ fontSize: 9, letterSpacing: ".1em" }}>LEVEL</span>
          <span className="faint" style={{ fontSize: 9, letterSpacing: ".1em" }}>SERVICE</span>
          <span className="faint" style={{ fontSize: 9, letterSpacing: ".1em" }}>MESSAGE</span>
        </div>

        <div style={{ maxHeight: "calc(100vh - 290px)", overflowY: "auto" }}>
          {shown.map((l, i) => (
            <div className="logline" key={l.t.getTime() + "-" + i} style={i === 0 && !paused ? { animation: "fadeup .3s" } : undefined}>
              <span className="lt">{fmt.time(l.t)}</span>
              <span className={"lvl " + l.lvl}>{l.lvl}</span>
              <span className="lsvc">{l.svc}</span>
              <span className="lmsg" style={l.lvl === "ERROR" ? { color: "var(--crit)" } : l.lvl === "AUDIT" ? { color: "var(--violet)" } : undefined}>{l.msg}</span>
            </div>
          ))}
          {shown.length === 0 && <div className="muted tc" style={{ padding: 40, fontSize: 13 }}>No log lines match this filter.</div>}
        </div>
      </div>
    </div>
  );
}
