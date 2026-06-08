// Relay Ops — admin console mock data (ported from admin-data.js).
// Internal observability data; no backend admin API yet.

const now = Date.now();
const ago = (m: number) => new Date(now - m * 60000);

export interface PlatformMeta { id: string; name: string; color: string; glyph: string; }
export const PLATFORMS: Record<string, PlatformMeta> = {
  meta: { id: "meta", name: "Meta", color: "#0866FF", glyph: "M" },
  google: { id: "google", name: "Google", color: "#4D9FFF", glyph: "G" },
  tiktok: { id: "tiktok", name: "TikTok", color: "#E4E8EF", glyph: "T" },
  linkedin: { id: "linkedin", name: "LinkedIn", color: "#3B9CE8", glyph: "in" },
  pinterest: { id: "pinterest", name: "Pinterest", color: "#E60023", glyph: "P" },
  snap: { id: "snap", name: "Snap", color: "#F5B043", glyph: "S" },
  x: { id: "x", name: "X", color: "#9BA6B4", glyph: "X" },
  reddit: { id: "reddit", name: "Reddit", color: "#FF5C5C", glyph: "r" },
  amazon: { id: "amazon", name: "Amazon", color: "#F5B043", glyph: "a" },
};

export const SERVICES = [
  { id: "api-gateway", name: "API Gateway", status: "ok", rps: 1840, p95: 42, err: 0.02, inst: "8/8", cpu: 38 },
  { id: "campaign-svc", name: "Campaign Service", status: "ok", rps: 420, p95: 88, err: 0.04, inst: "6/6", cpu: 51 },
  { id: "orchestrator", name: "Temporal Orchestr.", status: "warn", rps: 96, p95: 310, err: 0.9, inst: "4/4", cpu: 72 },
  { id: "adapter-pool", name: "Adapter Workers", status: "ok", rps: 512, p95: 640, err: 1.2, inst: "14/16", cpu: 64 },
  { id: "creative-svc", name: "Creative Engine", status: "ok", rps: 38, p95: 1200, err: 0.3, inst: "5/5", cpu: 44 },
  { id: "compliance", name: "Compliance Engine", status: "ok", rps: 210, p95: 54, err: 0.01, inst: "4/4", cpu: 29 },
  { id: "metrics-svc", name: "Metrics Ingest", status: "crit", rps: 0, p95: 0, err: 100, inst: "2/4", cpu: 0, note: "ClickHouse writer pool degraded" },
  { id: "identity", name: "Identity / Access", status: "ok", rps: 680, p95: 36, err: 0.0, inst: "4/4", cpu: 33 },
];

export const INFRA = [
  { id: "postgres", name: "PostgreSQL (primary)", status: "ok", metric: "conns 142/300", sub: "replica lag 0.4s" },
  { id: "redis", name: "Redis Cluster", status: "ok", metric: "mem 41%", sub: "hit-rate 98.7%" },
  { id: "clickhouse", name: "ClickHouse", status: "warn", metric: "merge backlog", sub: "parts 1.2k · ingest lag 7m" },
  { id: "kafka", name: "Kafka", status: "ok", metric: "lag 2.1k msg", sub: "12 consumer groups" },
  { id: "temporal", name: "Temporal Cluster", status: "ok", metric: "42 workflows/s", sub: "history shard ok" },
  { id: "s3", name: "Object Storage", status: "ok", metric: "18.4 TB", sub: "4xx 0.01%" },
  { id: "vault", name: "Secrets Vault", status: "ok", metric: "seal: unsealed", sub: "leases 3.1k" },
];

export interface Tenant {
  id: string; name: string; plan: string; workspaces: number; seats: number; mrr: number;
  spend30: number; status: string; health: number; since: string; owner: string; adapters: string[];
}
export const TENANTS: Tenant[] = [
  { id: "org_northwind", name: "Northwind Coffee Co.", plan: "Scale", workspaces: 3, seats: 14, mrr: 2400, spend30: 184200, status: "active", health: 98, since: "2024-08", owner: "maya@northwind.co", adapters: ["meta", "google", "tiktok", "linkedin"] },
  { id: "org_brightline", name: "Brightline Agency", plan: "Agency", workspaces: 28, seats: 64, mrr: 8800, spend30: 1240000, status: "active", health: 95, since: "2023-11", owner: "ops@brightline.io", adapters: ["meta", "google", "tiktok", "linkedin", "pinterest", "snap"] },
  { id: "org_lumen", name: "Lumen Fitness", plan: "Growth", workspaces: 2, seats: 8, mrr: 900, spend30: 98400, status: "active", health: 91, since: "2025-02", owner: "gus@lumen.app", adapters: ["tiktok", "meta", "snap"] },
  { id: "org_plumbline", name: "Plumbline Services", plan: "Starter", workspaces: 1, seats: 3, mrr: 120, spend30: 12200, status: "past_due", health: 62, since: "2025-09", owner: "raj@plumbline.in", adapters: ["google", "meta"] },
  { id: "org_vertex", name: "Vertex Commerce", plan: "Scale", workspaces: 6, seats: 22, mrr: 3600, spend30: 402000, status: "active", health: 88, since: "2024-04", owner: "finance@vertex.com", adapters: ["meta", "google", "amazon", "pinterest"] },
  { id: "org_drift", name: "Drift Media", plan: "Agency", workspaces: 19, seats: 41, mrr: 6400, spend30: 880000, status: "active", health: 97, since: "2024-01", owner: "admin@drift.media", adapters: ["meta", "google", "tiktok", "x", "reddit"] },
  { id: "org_aster", name: "Aster Skincare", plan: "Growth", workspaces: 2, seats: 6, mrr: 900, spend30: 142000, status: "suspended", health: 34, since: "2025-05", owner: "ops@aster.beauty", adapters: ["meta", "tiktok"] },
  { id: "org_kettle", name: "Kettle & Co", plan: "Starter", workspaces: 1, seats: 2, mrr: 120, spend30: 8400, status: "active", health: 84, since: "2025-10", owner: "sam@kettle.co", adapters: ["meta"] },
];

export const ADAPTERS = [
  { id: "meta", calls24: 184200, success: 99.4, rejects: 412, p95: 680, tokens: "842 ok · 6 expiring", quota: 72, status: "ok" },
  { id: "google", calls24: 142800, success: 99.1, rejects: 380, p95: 540, tokens: "690 ok · 2 expiring", quota: 64, status: "ok" },
  { id: "tiktok", calls24: 98400, success: 97.2, rejects: 1820, p95: 910, tokens: "410 ok · 14 expiring", quota: 88, status: "warn" },
  { id: "linkedin", calls24: 42100, success: 99.6, rejects: 88, p95: 420, tokens: "212 ok", quota: 38, status: "ok" },
  { id: "pinterest", calls24: 18600, success: 94.1, rejects: 1100, p95: 1240, tokens: "96 ok · 3 expiring", quota: 54, status: "warn" },
  { id: "snap", calls24: 12200, success: 98.8, rejects: 140, p95: 760, tokens: "74 ok", quota: 31, status: "ok" },
  { id: "x", calls24: 8800, success: 91.2, rejects: 770, p95: 1680, tokens: "40 ok · 8 errors", quota: 42, status: "crit" },
  { id: "reddit", calls24: 6400, success: 97.9, rejects: 130, p95: 880, tokens: "31 ok", quota: 22, status: "ok" },
];

export interface Workflow {
  id: string; tenant: string; type: string; state: string; started: Date;
  platforms: string[]; done: number; total: number; attempt: number; error?: string;
}
export const WORKFLOWS: Workflow[] = [
  { id: "launch-CMP3041-7f2", tenant: "Northwind Coffee", type: "LaunchWorkflow", state: "running", started: ago(2), platforms: ["meta", "google", "tiktok"], done: 2, total: 3, attempt: 1 },
  { id: "launch-CMP4188-a1c", tenant: "Brightline Agency", type: "LaunchWorkflow", state: "running", started: ago(1), platforms: ["meta", "linkedin"], done: 1, total: 2, attempt: 1 },
  { id: "launch-CMP4012-9b3", tenant: "Vertex Commerce", type: "LaunchWorkflow", state: "completed", started: ago(8), platforms: ["meta", "google", "amazon"], done: 3, total: 3, attempt: 1 },
  { id: "metric-poll-tiktok", tenant: "— system", type: "MetricPoll", state: "running", started: ago(0), platforms: ["tiktok"], done: 0, total: 1, attempt: 1 },
  { id: "launch-CMP3990-3d1", tenant: "Drift Media", type: "LaunchWorkflow", state: "failed", started: ago(22), platforms: ["x", "meta"], done: 1, total: 2, attempt: 5, error: "X adapter — INVALID_CREDS" },
  { id: "creative-AST9003", tenant: "Lumen Fitness", type: "CreativeJob", state: "running", started: ago(3), platforms: [], done: 4, total: 6, attempt: 1 },
  { id: "launch-CMP3870-77a", tenant: "Aster Skincare", type: "LaunchWorkflow", state: "terminated", started: ago(60), platforms: ["meta", "tiktok"], done: 0, total: 2, attempt: 3, error: "Tenant suspended mid-launch" },
];

export const DLQ = [
  { id: "evt_8841", topic: "metric.ingested", tenant: "Vertex Commerce", reason: "ClickHouse write timeout", attempts: 6, age: "12m" },
  { id: "evt_8839", topic: "metric.ingested", tenant: "Drift Media", reason: "ClickHouse write timeout", attempts: 6, age: "13m" },
  { id: "evt_8801", topic: "adapter.callback", tenant: "Brightline", reason: "Signature verify failed", attempts: 3, age: "41m" },
  { id: "evt_8772", topic: "webhook.meta", tenant: "Northwind", reason: "Unknown event schema", attempts: 2, age: "1h" },
];

export interface LogLine { t: Date; lvl: string; svc: string; msg: string; }
export const LOG_SEED: LogLine[] = [
  { t: ago(0), lvl: "ERROR", svc: "metrics-svc", msg: "ClickHouse writer pool exhausted — 4 pending batches dropped to DLQ" },
  { t: ago(0), lvl: "WARN", svc: "orchestrator", msg: "Activity SubmitDeployment[tiktok] retry 2/5 after 429 rate_limited" },
  { t: ago(1), lvl: "INFO", svc: "campaign-svc", msg: "Campaign CMP-4188 launch accepted → workflow launch-CMP4188-a1c" },
  { t: ago(1), lvl: "AUDIT", svc: "identity", msg: "admin:maya impersonated workspace=northwind/main (ticket OPS-3120)" },
  { t: ago(1), lvl: "INFO", svc: "adapter-pool", msg: "meta.submit deployment=dep_9f21 → ext_campaign=120210 (412ms)" },
  { t: ago(2), lvl: "WARN", svc: "adapter-pool", msg: "x.classifyError → INVALID_CREDS for connection la_2290 (non-retryable)" },
  { t: ago(2), lvl: "INFO", svc: "compliance", msg: "preflight CMP-4012 → PASS (1 warning: TEXT_ON_IMAGE 0.22)" },
  { t: ago(3), lvl: "DEBUG", svc: "api-gateway", msg: "GET /v1/connections ws=vertex/3 200 in 18ms" },
  { t: ago(3), lvl: "ERROR", svc: "adapter-pool", msg: "pinterest.submit 5xx upstream — deployment=dep_3a10 retry scheduled" },
  { t: ago(4), lvl: "INFO", svc: "creative-svc", msg: "derive AST-9003 → 9:16 transcode complete (1.2s)" },
];

const rnd = (a: number, b: number) => Math.floor(a + Math.random() * (b - a));
const pick = <T,>(a: T[]): T => a[rnd(0, a.length)];
const hex = () => Math.random().toString(16).slice(2, 8);
const LOG_TEMPLATES: { lvl: string; svc: string; msg: () => string }[] = [
  { lvl: "INFO", svc: "api-gateway", msg: () => `GET /v1/campaigns ws=${pick(["northwind/main", "drift/14", "vertex/2"])} 200 in ${rnd(8, 40)}ms` },
  { lvl: "INFO", svc: "adapter-pool", msg: () => `${pick(["meta", "google", "tiktok", "linkedin"])}.fetchMetrics dep=dep_${hex()} ${rnd(40, 900)}ms` },
  { lvl: "DEBUG", svc: "metrics-svc", msg: () => `normalize batch=${rnd(200, 1400)} rows → clickhouse buffer` },
  { lvl: "WARN", svc: "orchestrator", msg: () => `activity retry ${rnd(1, 4)}/5 platform=${pick(["tiktok", "x", "pinterest"])} after 429` },
  { lvl: "INFO", svc: "compliance", msg: () => `preflight CMP-${rnd(3000, 4999)} → ${pick(["PASS", "PASS", "PASS", "BLOCK (HEADLINE_LEN)"])}` },
  { lvl: "INFO", svc: "identity", msg: () => `token refresh ${pick(["meta", "google", "tiktok"])} conn=${hex()} ok` },
  { lvl: "ERROR", svc: "metrics-svc", msg: () => `clickhouse write timeout batch=${hex()} → DLQ` },
];
export function nextLog(): LogLine {
  const tpl = pick(LOG_TEMPLATES);
  return { t: new Date(), lvl: tpl.lvl, svc: tpl.svc, msg: tpl.msg() };
}

export interface Alert {
  id: string; sev: string; title: string; svc: string; state: string; since: Date; ack: boolean; rule: string; desc: string;
}
export const ALERTS: Alert[] = [
  { id: "INC-2207", sev: "critical", title: "Metrics ingestion halted", svc: "metrics-svc", state: "firing", since: ago(6), ack: false, rule: "ingest_error_rate > 50%", desc: "ClickHouse writer pool degraded; metric snapshots routing to DLQ. Dashboards stale > 5m." },
  { id: "INC-2206", sev: "warning", title: "TikTok adapter reject spike", svc: "adapter-pool", state: "firing", since: ago(34), ack: true, rule: "reject_rate[tiktok] > 1.5%", desc: "Reject rate 2.8% (baseline 0.6%) — likely policy pack drift on creative text ratio." },
  { id: "INC-2205", sev: "warning", title: "Orchestrator p95 elevated", svc: "orchestrator", state: "firing", since: ago(48), ack: false, rule: "p95_latency > 250ms", desc: "Launch saga scheduling latency climbing with queue depth 1.4k." },
  { id: "INC-2204", sev: "critical", title: "X adapter auth failures", svc: "adapter-pool", state: "acked", since: ago(120), ack: true, rule: "auth_error[x] > 5", desc: "8 connections returning INVALID_CREDS — OAuth app review likely required." },
  { id: "INC-2201", sev: "info", title: "Deploy v1.42.0 rolled out", svc: "platform", state: "resolved", since: ago(220), ack: true, rule: "deploy", desc: "Canary 100% — adapter SDK retry policy update." },
];

export const MAIL_STREAM = [
  { id: "msg_5521", to: "maya@northwind.co", template: "launch_complete", subject: "Your campaign is live on 3 platforms", status: "delivered", opened: true, t: ago(2) },
  { id: "msg_5520", to: "ops@brightline.io", template: "budget_alert", subject: "Daily budget 90% spent — Spring Roast", status: "delivered", opened: false, t: ago(5) },
  { id: "msg_5519", to: "raj@plumbline.in", template: "payment_failed", subject: "Action needed: payment method declined", status: "bounced", opened: false, t: ago(9) },
  { id: "msg_5518", to: "gus@lumen.app", template: "verification", subject: "TikTok pixel not detected", status: "delivered", opened: true, t: ago(14) },
  { id: "msg_5517", to: "finance@vertex.com", template: "weekly_digest", subject: "Your weekly performance digest", status: "delivered", opened: true, t: ago(22) },
  { id: "msg_5516", to: "admin@drift.media", template: "incident", subject: "Resolved: metric delay on 2 campaigns", status: "queued", opened: false, t: ago(1) },
];

export const MAIL_TEMPLATES = [
  { id: "launch_complete", name: "Launch complete", cat: "Transactional", sent30: 18420, open: 62.1, ctr: 14.2 },
  { id: "budget_alert", name: "Budget threshold", cat: "Alert", sent30: 8240, open: 71.4, ctr: 0 },
  { id: "payment_failed", name: "Payment failed", cat: "Billing", sent30: 412, open: 88.0, ctr: 64.0 },
  { id: "verification", name: "Verification issue", cat: "Alert", sent30: 2210, open: 69.0, ctr: 41.0 },
  { id: "weekly_digest", name: "Weekly digest", cat: "Lifecycle", sent30: 42800, open: 38.4, ctr: 9.1 },
  { id: "incident", name: "Incident update", cat: "System", sent30: 96, open: 91.0, ctr: 0 },
  { id: "welcome", name: "Welcome / onboarding", cat: "Lifecycle", sent30: 1840, open: 74.2, ctr: 33.0 },
];

export const OVERVIEW: Record<string, { v: string; d: number; series: number[]; bad?: boolean }> = {
  tenants: { v: "248", d: 6, series: [18, 20, 19, 22, 24, 23, 26, 28, 27, 30, 32, 34] },
  launches: { v: "1,204", d: 18, series: [10, 14, 12, 18, 16, 22, 24, 21, 28, 30, 27, 34] },
  apiCalls: { v: "2.4M", d: 9, series: [20, 22, 21, 26, 28, 27, 30, 33, 31, 36, 38, 42] },
  errRate: { v: "1.2%", d: 0.7, series: [6, 7, 6, 8, 7, 9, 11, 10, 14, 18, 22, 26], bad: true },
  spendMTD: { v: "$4.1M", d: 12, series: [14, 16, 18, 17, 22, 24, 23, 28, 30, 29, 34, 38] },
  mailSent: { v: "74.2K", d: 4, series: [22, 24, 23, 26, 25, 28, 30, 29, 32, 31, 34, 36] },
};

export const fmt = {
  money: (n: number) => (n >= 1e6 ? "$" + (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? "$" + (n / 1e3).toFixed(0) + "K" : "$" + n),
  num: (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : "" + n),
  time: (d: Date) => d.toLocaleTimeString("en-US", { hour12: false }),
  ago: (d: Date) => {
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return s + "s";
    if (s < 3600) return Math.floor(s / 60) + "m";
    if (s < 86400) return Math.floor(s / 3600) + "h";
    return Math.floor(s / 86400) + "d";
  },
};
