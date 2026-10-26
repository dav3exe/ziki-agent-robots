import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewIssueForm from "@/components/new-issue-form";

export const metadata: Metadata = { title: "Report an issue · Ziki" };

export default function NewIssuePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/issues" className="inline-flex items-center gap-2 text-sm font-semibold text-zk-accent">
        <ArrowLeft className="size-4" /> Back to issues
      </Link>
      <div>
        <h1 className="font-display text-3xl font-extrabold">Report an issue</h1>
        <p className="mt-2 text-sm text-zk-text2">Include a type, clear description, and optional GitHub PR so the team can triage quickly.</p>
      </div>
      <NewIssueForm />
    </div>
  );
}
