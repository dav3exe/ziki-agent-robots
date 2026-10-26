/** Ziki's card: a surface with a small uppercase label. */
export default function Card({ label, right, children, className = "" }: { label?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-zk-border bg-zk-surface p-4 sm:p-5 ${className}`}>
      {(label || right) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {label && <h2 className="text-xs font-bold tracking-wider text-zk-text2 uppercase">{label}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}
