import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { CourseForm } from "@/components/teach/CourseForm";
import { findCountry } from "@/lib/countries";
import { PLATFORM_FEE_RATE } from "@/lib/config";

export const metadata = { title: "New course" };

export default async function NewCoursePage() {
  const user = await requireRole(["teacher", "admin"], "/teach/courses/new");
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link href="/teach/dashboard" className="flex items-center gap-1 text-sm font-semibold text-earth-soft"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">New course</h1>
      <p className="mt-1 text-earth-soft">Start with the basics. You will add lessons on the next screen.</p>
      <div className="card mt-6 p-5">
        <CourseForm defaultCurrency={findCountry(user.profile.country)?.currency ?? "USD"} feeRate={PLATFORM_FEE_RATE} />
      </div>
    </div>
  );
}
