import type { Metadata } from "next";
import "./admin.css";
import { AuthGate } from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Relay Ops — Super Admin Console",
  description: "Platform operations, tenants, adapters, workflows, security.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
