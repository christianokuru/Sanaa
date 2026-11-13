import { LoginForm } from "@/components/AuthForms";

export const metadata = { title: "Log in" };

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="mt-1 text-earth-soft">Log in to keep learning.</p>
      <div className="card mt-6 p-5"><LoginForm next={searchParams.next} /></div>
    </div>
  );
}
