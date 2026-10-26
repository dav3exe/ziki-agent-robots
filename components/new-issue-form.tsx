"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";

const field = "w-full rounded-lg border border-zk-border bg-zk-seg px-3 py-2.5 text-sm text-zk-text outline-none placeholder:text-zk-muted focus:border-zk-accent";
const label = "mb-1.5 block text-sm font-semibold";

/** Ziki's "Report an issue" form. It's a mock-up: submitting shows a note instead of saving anything. */
export default function NewIssueForm() {
  const [mode, setMode] = useState<"quick" | "detailed">("detailed");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-xl border border-zk-border bg-zk-surface">
      <div role="tablist" className="flex gap-1 border-b border-zk-divider px-4 sm:px-6">
        {(["quick", "detailed"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`border-b-2 px-3 py-3.5 text-sm font-semibold ${mode === m ? "border-zk-accent text-zk-accent" : "border-transparent text-zk-text2"}`}
          >
            {m === "quick" ? "Quick report" : "Detailed issue"}
          </button>
        ))}
      </div>
      <form
        className="space-y-5 p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div>
          <label htmlFor="title" className={label}>Title</label>
          <input id="title" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short summary of the issue" className={field} />
          <p className="mt-1 text-right text-xs text-zk-muted">{title.length}/200</p>
        </div>
        {mode === "detailed" && (
          <>
            <div>
              <label htmlFor="type" className={label}>Type</label>
              <select id="type" defaultValue="Fix" className={field}>
                {["Design", "Feat", "Fix", "Marketing"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="platform" className={label}>Platform</label>
              <select id="platform" defaultValue="" className={field}>
                <option value="" disabled>Select a platform</option>
                {["Desktop", "Mobile", "Web"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </>
        )}
        <div>
          <label htmlFor="body" className={label}>Description</label>
          <textarea id="body" rows={6} maxLength={5000} value={body} onChange={(e) => setBody(e.target.value)} className={field} placeholder="What should happen, what actually happens, and how to reproduce it." />
          <p className="mt-1 flex justify-between text-xs text-zk-muted">
            <span>Markdown is supported. Paste or drop images.</span>
            <span>{body.length}/5000</span>
          </p>
        </div>
        {mode === "detailed" && (
          <>
            <div>
              <label htmlFor="pr" className={label}>GitHub PR</label>
              <textarea id="pr" rows={2} className={field} placeholder="https://github.com/organization/repo/pull/123" />
              <p className="mt-1 text-xs text-zk-muted">Optional. One GitHub link per line.</p>
            </div>
            <div>
              <p className={label}>Screenshots and files</p>
              <button type="button" className="flex items-center gap-2 rounded-lg border border-dashed border-zk-border px-3 py-2 text-sm text-zk-text2">
                <Paperclip className="size-4" /> Attach files
              </button>
              <p className="mt-1 text-xs text-zk-muted">PNG, JPG, GIF, WebP, PDF, or a text log / JSON / HAR file. Up to 5 MB each, 5 per issue or comment.</p>
            </div>
          </>
        )}
        <label className="flex items-center gap-2 text-sm text-zk-text2">
          <input type="checkbox" className="size-4 accent-zk-blue" /> Assign this issue to myself
        </label>
        <button type="submit" className="rounded-[10px] bg-zk-blue px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">Create issue</button>
        {sent && (
          <p role="status" className="rounded-lg border border-zk-info-fg/30 bg-zk-info-bg px-3 py-2 text-sm text-zk-info-fg">
            This is a mock-up, so nothing was saved. On Ziki, agents would pick this up and review it from here.
          </p>
        )}
      </form>
    </div>
  );
}
