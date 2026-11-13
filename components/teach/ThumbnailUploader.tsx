"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { setThumbnail } from "@/lib/actions/teach";

// Shrink big phone photos before upload to save the teacher's data.
async function resize(file: File, maxW = 1280): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, maxW / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("resize failed"))), "image/jpeg", 0.82));
}

export function ThumbnailUploader({ courseId, userId, current }: { courseId: string; userId: string; current: string | null }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const blob = await resize(file);
      const supabase = createClient();
      const path = `${userId}/${courseId}-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage.from("thumbnails").upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
      await setThumbnail(courseId, data.publicUrl);
      router.refresh();
    } catch {
      setError("Upload failed. Try a different photo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="relative block aspect-video w-full overflow-hidden rounded-2xl border-2 border-dashed border-earth/20 bg-sand"
      >
        {current && <img src={current} alt="Course cover" className="absolute inset-0 h-full w-full object-cover" />}
        <span className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm font-semibold ${current ? "bg-earth/40 text-white opacity-0 hover:opacity-100" : ""}`}>
          {busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          {busy ? "Uploading..." : current ? "Change cover photo" : "Add a cover photo"}
        </span>
      </button>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      {error && <p className="mt-2 text-sm text-terracotta-dark">{error}</p>}
    </div>
  );
}
