// Relay Ops — Access & Security mock data (ported from admin-security-data.js).

const now = Date.now();
const ago = (m: number) => new Date(now - m * 60000);

export interface Session {
  id: string; user: string; email: string; tenant: string; role: string; kind: string;
  ip: string; ipType: string; isp: string; asn: string;
  city: string; region: string; country: string; cc: string; coords: string; tz: string;
  device: string; os: string; browser: string; screen: string; lang: string;
  fp: string; trusted: boolean; method: string; mfa: string;
  started: Date; last: Date; expires: string; risk: string; current: boolean; flags?: string[];
}

export const SESSIONS: Session[] = [
  { id: "sess_a1f3c90", user: "Maya Okonkwo", email: "maya@northwind.co", tenant: "Northwind Coffee", role: "Owner", kind: "tenant", ip: "73.118.42.9", ipType: "Residential", isp: "Comcast Cable", asn: "AS7922", city: "Seattle", region: "WA", country: "United States", cc: "US", coords: "47.61, -122.33", tz: "America/Los_Angeles", device: "desktop", os: "macOS 15.3", browser: "Chrome 138", screen: "2560×1440", lang: "en-US", fp: "d41a8c…9f2b", trusted: true, method: "Password + Passkey", mfa: "WebAuthn (Touch ID)", started: ago(42), last: ago(1), expires: "in 7d", risk: "low", current: false },
  { id: "sess_OP_self", user: "Ops Admin", email: "ops@relay.io", tenant: "— Relay Platform", role: "Platform SRE", kind: "admin", ip: "198.51.100.24", ipType: "Corporate VPN", isp: "Relay Corp", asn: "AS14618", city: "New York", region: "NY", country: "United States", cc: "US", coords: "40.71, -74.00", tz: "America/New_York", device: "desktop", os: "Ubuntu 24.04", browser: "Firefox 130", screen: "1920×1080", lang: "en-US", fp: "7b2e91…c4a0", trusted: true, method: "SSO (Okta) + Passkey", mfa: "WebAuthn (YubiKey)", started: ago(120), last: ago(0), expires: "in 11h", risk: "low", current: true },
  { id: "sess_88b21fe", user: "Raj Mehta", email: "raj@plumbline.in", tenant: "Plumbline Services", role: "Admin", kind: "tenant", ip: "103.21.58.140", ipType: "Mobile", isp: "Jio", asn: "AS55836", city: "Bengaluru", region: "KA", country: "India", cc: "IN", coords: "12.97, 77.59", tz: "Asia/Kolkata", device: "mobile", os: "Android 15", browser: "Chrome Mobile 138", screen: "412×915", lang: "en-IN", fp: "a90f3d…1e77", trusted: true, method: "Password + SMS", mfa: "SMS OTP", started: ago(15), last: ago(2), expires: "in 6d", risk: "medium", current: false },
  { id: "sess_5c0d77a", user: "Gus Lindqvist", email: "gus@lumen.app", tenant: "Lumen Fitness", role: "Editor", kind: "tenant", ip: "185.220.101.47", ipType: "Tor Exit Node", isp: "Tor Project", asn: "AS208294", city: "Frankfurt", region: "HE", country: "Germany", cc: "DE", coords: "50.11, 8.68", tz: "Europe/Berlin", device: "desktop", os: "Windows 11", browser: "Chrome 137", screen: "1536×864", lang: "en-US", fp: "f02b7a…88d1", trusted: false, method: "Password only", mfa: "None", started: ago(8), last: ago(1), expires: "in 6d", risk: "high", current: false, flags: ["New device", "Tor exit node", "MFA not enrolled", "Impossible travel"] },
  { id: "sess_3e9aa12", user: "Brightline Ops", email: "ops@brightline.io", tenant: "Brightline Agency", role: "Owner", kind: "tenant", ip: "52.36.119.4", ipType: "Datacenter (AWS)", isp: "Amazon AWS", asn: "AS16509", city: "Portland", region: "OR", country: "United States", cc: "US", coords: "45.52, -122.67", tz: "America/Los_Angeles", device: "desktop", os: "macOS 14.6", browser: "Safari 18", screen: "1800×1169", lang: "en-US", fp: "c71e44…3b90", trusted: true, method: "SSO (Google)", mfa: "Google Prompt", started: ago(200), last: ago(12), expires: "in 5d", risk: "medium", current: false, flags: ["Datacenter IP"] },
  { id: "sess_9d4b6c1", user: "Sofia Reyes", email: "sofia@drift.media", tenant: "Drift Media", role: "Admin", kind: "tenant", ip: "81.2.69.142", ipType: "Residential", isp: "BT Group", asn: "AS2856", city: "London", region: "ENG", country: "United Kingdom", cc: "GB", coords: "51.50, -0.12", tz: "Europe/London", device: "tablet", os: "iPadOS 18", browser: "Safari 18", screen: "1024×1366", lang: "en-GB", fp: "b338f0…7c21", trusted: true, method: "Password + Passkey", mfa: "WebAuthn (Face ID)", started: ago(64), last: ago(5), expires: "in 6d", risk: "low", current: false },
];

export interface AuthEvent { t: Date; type: string; user: string; ip: string; loc: string; device: string; method: string; detail: string; }
export const AUTH_EVENTS: AuthEvent[] = [
  { t: ago(1), type: "login_success", user: "maya@northwind.co", ip: "73.118.42.9", loc: "Seattle, US", device: "macOS · Chrome", method: "Passkey", detail: "WebAuthn assertion verified" },
  { t: ago(2), type: "mfa_challenge", user: "raj@plumbline.in", ip: "103.21.58.140", loc: "Bengaluru, IN", device: "Android · Chrome", method: "SMS", detail: "OTP delivered & verified" },
  { t: ago(6), type: "login_failed", user: "gus@lumen.app", ip: "185.220.101.47", loc: "Frankfurt, DE", device: "Windows · Chrome", method: "Password", detail: "Wrong password (attempt 2/5)" },
  { t: ago(7), type: "new_device", user: "gus@lumen.app", ip: "185.220.101.47", loc: "Frankfurt, DE", device: "Windows · Chrome", method: "—", detail: "Unrecognized device fingerprint" },
  { t: ago(8), type: "suspicious", user: "gus@lumen.app", ip: "185.220.101.47", loc: "Frankfurt, DE", device: "Windows · Chrome", method: "—", detail: "Tor exit node + impossible travel (prev: Stockholm 11m ago)" },
  { t: ago(14), type: "impersonation_start", user: "ops@relay.io", ip: "198.51.100.24", loc: "New York, US", device: "Ubuntu · Firefox", method: "Admin", detail: "Impersonated workspace=northwind/main (ticket OPS-3120)" },
  { t: ago(22), type: "login_success", user: "ops@brightline.io", ip: "52.36.119.4", loc: "Portland, US", device: "macOS · Safari", method: "SSO", detail: "Google SSO — domain verified" },
  { t: ago(30), type: "logout", user: "sofia@drift.media", ip: "81.2.69.142", loc: "London, GB", device: "iPadOS · Safari", method: "—", detail: "User-initiated sign out" },
  { t: ago(45), type: "password_reset", user: "aster@aster.beauty", ip: "45.83.12.6", loc: "Madrid, ES", device: "Windows · Edge", method: "Email", detail: "Reset link issued & consumed" },
  { t: ago(60), type: "login_success", user: "maya@northwind.co", ip: "73.118.42.9", loc: "Seattle, US", device: "macOS · Chrome", method: "Passkey", detail: "Trusted device" },
  { t: ago(72), type: "mfa_failed", user: "raj@plumbline.in", ip: "103.21.58.140", loc: "Bengaluru, IN", device: "Android · Chrome", method: "SMS", detail: "OTP expired — re-sent" },
  { t: ago(90), type: "impersonation_end", user: "ops@relay.io", ip: "198.51.100.24", loc: "New York, US", device: "Ubuntu · Firefox", method: "Admin", detail: "Ended impersonation session (8m)" },
];

export const EVENT_META: Record<string, { label: string; tone: string; icon: string }> = {
  login_success: { label: "Login success", tone: "ok", icon: "check" },
  login_failed: { label: "Login failed", tone: "crit", icon: "x" },
  mfa_challenge: { label: "MFA verified", tone: "info", icon: "shield" },
  mfa_failed: { label: "MFA failed", tone: "warn", icon: "shield" },
  new_device: { label: "New device", tone: "warn", icon: "cpu" },
  suspicious: { label: "Suspicious", tone: "crit", icon: "alert" },
  impersonation_start: { label: "Impersonation", tone: "violet", icon: "user" },
  impersonation_end: { label: "Impersonation end", tone: "violet", icon: "user" },
  logout: { label: "Logout", tone: "idle", icon: "ext" },
  password_reset: { label: "Password reset", tone: "warn", icon: "shield" },
};

export const POSTURE: Record<string, { v: string; d: number; bad?: boolean }> = {
  activeSessions: { v: "1,284", d: 3 },
  logins24: { v: "4,021", d: 8 },
  failed24: { v: "182", d: 22, bad: true },
  mfaCoverage: { v: "94.2%", d: 1.4 },
  suspicious: { v: "3", d: 2, bad: true },
};

export const DEVICE_MIX = [
  { k: "Desktop", v: 62, color: "var(--acc)" },
  { k: "Mobile", v: 28, color: "var(--blue)" },
  { k: "Tablet", v: 10, color: "var(--violet)" },
];
export const METHOD_MIX = [
  { k: "Passkey / WebAuthn", v: 48, color: "var(--acc)" },
  { k: "SSO (Okta/Google)", v: 31, color: "var(--blue)" },
  { k: "Password + SMS", v: 15, color: "var(--warn)" },
  { k: "Password only", v: 6, color: "var(--crit)" },
];

export const riskTone = (r: string) => (r === "high" ? "crit" : r === "medium" ? "warn" : "ok");
