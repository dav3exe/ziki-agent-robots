/** Marks what the robots add to Ziki, so reviewers can tell it from the existing screens. */
export default function NewTag({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-dashed border-zk-accent/60 px-1.5 text-[10px] font-bold tracking-wide text-zk-accent uppercase ${className}`}>
      New
    </span>
  );
}
