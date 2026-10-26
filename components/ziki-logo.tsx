/** Ziki's mark (a stacked "Z") and name. */
export default function ZikiLogo() {
  return (
    <>
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <path d="M4 4h16l-3 4H4z" fill="#3978f6" />
        <path d="M17 10 7 18h13l-3 3H3l11-11z" fill="#679bf8" />
      </svg>
      <span className="font-display text-[17px] font-extrabold tracking-tight text-zk-text">ziki</span>
    </>
  );
}
