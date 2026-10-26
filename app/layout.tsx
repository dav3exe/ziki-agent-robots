import type { Metadata } from "next";
import { Geist_Mono, Inter, Manrope } from "next/font/google";
import AgentLayer from "@/components/agents/agent-layer";
import AppHeader from "@/components/app-header";
import BottomNav from "@/components/bottom-nav";
import ProposalLink from "@/components/proposal-link";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ziki agent robots",
  description: "Ziki agents shown as pixel robots along the bottom of the screen, working, reviewing, knocking for a person or wandering.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} ${geistMono.variable} min-h-screen overflow-x-clip font-sans antialiased`}>
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-2 pt-2.5 pb-28 sm:px-6 sm:py-8 sm:pb-28 lg:pb-8">
            {children}
          </main>
          <AgentLayer />
        </div>
        <BottomNav />
        <ProposalLink />
      </body>
    </html>
  );
}
