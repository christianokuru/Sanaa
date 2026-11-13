import { notFound } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import { PrintButton } from "@/components/PrintButton";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabase } from "@/lib/config";

export const metadata = { title: "Certificate" };

// Public page so anyone (e.g. a customer) can check the certificate is real.
export default async function CertificatePage({ params }: { params: { id: string } }) {
  if (!hasSupabase || !/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  const { data } = await createAdminClient()
    .from("enrollments")
    .select("id, completed_at, student:profiles!enrollments_student_id_fkey(full_name), course:courses(title, teacher:profiles!courses_teacher_id_fkey(full_name))")
    .eq("id", params.id)
    .maybeSingle();
  const row = data as unknown as {
    id: string; completed_at: string | null;
    student: { full_name: string } | null;
    course: { title: string; teacher: { full_name: string } | null } | null;
  } | null;
  if (!row?.completed_at || !row.course) notFound();

  const date = new Date(row.completed_at).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl border-4 border-earth bg-white text-center shadow-card">
        <div className="kente h-4" />
        <div className="px-6 py-10 md:px-16 md:py-14">
          <div className="flex justify-center"><LogoMark className="h-12 w-12" /></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[.3em] text-terracotta">Certificate of completion</p>
          <p className="mt-6 text-earth-soft">This certifies that</p>
          <p className="mt-2 font-display text-4xl font-extrabold">{row.student?.full_name || "Student"}</p>
          <p className="mt-6 text-earth-soft">has completed the course</p>
          <p className="mt-2 font-display text-2xl font-bold">{row.course.title}</p>
          {row.course.teacher && <p className="mt-2 text-sm text-earth-soft">taught by {row.course.teacher.full_name}</p>}
          <p className="mt-8 text-sm">{date}</p>
          <p className="mt-1 text-xs text-earth/40">Certificate ID: {row.id}</p>
        </div>
        <div className="kente h-4" />
      </div>
      <div className="mt-6 flex justify-center print:hidden"><PrintButton /></div>
    </div>
  );
}
