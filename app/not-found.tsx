import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-terracotta">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold">Page not found</h1>
      <Link href="/" className="btn-primary mt-8">Go home</Link>
    </div>
  );
}
