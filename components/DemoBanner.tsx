import { hasSupabase } from "@/lib/config";

export function DemoBanner() {
  if (hasSupabase) return null;
  return (
    <div className="bg-gold-light px-4 py-2 text-center text-xs font-medium text-earth">
      Demo mode: showing sample courses. Connect Supabase to enable sign up, uploads and payments.
    </div>
  );
}
