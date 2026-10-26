const COLORS = ["#7c3aed", "#db2777", "#0891b2", "#16a34a", "#ea580c", "#2563eb"];

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");

/** A round avatar with the person's initials, coloured by name so the same person always gets the same colour. */
export default function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const color = COLORS[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % COLORS.length];
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}
