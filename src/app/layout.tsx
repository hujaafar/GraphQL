import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Graphite — Your learning, connected", template: "%s · Graphite" },
  description: "A considered view of your Reboot01 learning journey. Explore experience, skills, projects, and peer audits with GraphQL.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Providers>{children}</Providers></body></html>;
}
