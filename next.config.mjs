/** @type {import('next').NextConfig} */
// Served at a path (/admin) when behind the single-host dev proxy, or at the root of a dedicated
// subdomain (admin.d0187.in) in production. Controlled by NEXT_BASE_PATH at build time.
const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
