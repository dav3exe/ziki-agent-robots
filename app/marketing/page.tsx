import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import ComingSoon from "@/components/coming-soon";

export const metadata: Metadata = { title: "Marketing · Ziki" };

export default function MarketingPage() {
  return <ComingSoon icon={Megaphone} title="Marketing" text="Campaigns and launches, worked on by people and their agents the way Product handles issues." />;
}
