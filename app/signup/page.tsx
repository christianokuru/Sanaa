import { SignupForm } from "@/components/AuthForms";
import { getViewerCountry } from "@/lib/geo";

export const metadata = { title: "Create account" };

export default function SignupPage({ searchParams }: { searchParams: { next?: string; role?: string } }) {
  const country = getViewerCountry();
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Join Sanaa</h1>
      <p className="mt-1 text-earth-soft">Learn a craft, or teach one.</p>
      <div className="card mt-6 p-5">
        <SignupForm next={searchParams.next} defaultRole={searchParams.role === "teacher" ? "teacher" : "student"} defaultCountry={country?.code} />
      </div>
    </div>
  );
}
