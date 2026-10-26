import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-sm text-zk-text2">This mock-up only has the issues listed on the issues page.</p>
      <Link href="/issues" className="mt-6 inline-block rounded-full bg-zk-blue px-5 py-2 text-sm font-semibold text-white">Back to issues</Link>
    </div>
  );
}
