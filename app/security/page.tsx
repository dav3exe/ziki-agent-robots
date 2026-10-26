import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import ComingSoon from "@/components/coming-soon";

export const metadata: Metadata = { title: "Security · Ziki" };

export default function SecurityPage() {
  return <ComingSoon icon={ShieldCheck} title="Security" text="Security findings and fixes, reported, confirmed and resolved by people and their agents." />;
}
