"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { SITE_URL, hasSupabase } from "@/lib/config";
import { chargeCurrency, convertPrice, getRates, rateFor } from "@/lib/currency";
import { getViewerCurrency } from "@/lib/geo";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPaymentLink, hasFlutterwave } from "@/lib/flutterwave";

export async function startCheckout(formData: FormData) {
  if (!hasSupabase) redirect("/courses");
  const courseId = String(formData.get("courseId") ?? "");
  const supabase = createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, price, currency, teacher_id, status")
    .eq("id", courseId)
    .eq("status", "published")
    .maybeSingle();
  if (!course) redirect("/courses");

  const back = `/courses/${course.slug}`;
  const user = await requireUser(back);
  const fail = (msg: string) => redirect(`${back}?error=${encodeURIComponent(msg)}`);

  const db = createAdminClient();
  const { data: existing } = await db
    .from("enrollments")
    .select("id")
    .eq("course_id", course.id)
    .eq("student_id", user.id)
    .maybeSingle();
  if (existing) redirect(`/learn/${course.slug}`);
  if (course.teacher_id === user.id) fail("This is your own course.");

  const rates = await getRates();
  const currency = chargeCurrency(getViewerCurrency());
  const amount = convertPrice(Number(course.price), course.currency, currency, rates);

  // Free course: enroll straight away.
  if (amount === 0) {
    await db.from("enrollments").upsert(
      { course_id: course.id, student_id: user.id },
      { onConflict: "course_id,student_id", ignoreDuplicates: true },
    );
    redirect(`/learn/${course.slug}`);
  }

  if (!hasFlutterwave) fail("Payments are not set up yet. Please try again later.");

  const txRef = `sanaa_${randomUUID()}`;
  const { error } = await db.from("payments").insert({
    tx_ref: txRef,
    student_id: user.id,
    course_id: course.id,
    teacher_id: course.teacher_id,
    amount,
    currency,
    usd_rate: rateFor(currency, rates),
  });
  if (error) fail("Could not start payment. Please try again.");

  let link: string | null = null;
  try {
    link = await createPaymentLink({
      txRef,
      amount,
      currency,
      redirectUrl: `${SITE_URL}/payment/callback`,
      email: user.email,
      name: user.profile.full_name || user.email,
      title: course.title,
      meta: { course_id: course.id, student_id: user.id },
    });
  } catch (e) {
    console.error("Flutterwave payment link failed", e);
  }
  if (!link) fail("Could not open the payment page. Please try again.");
  redirect(link!);
}
