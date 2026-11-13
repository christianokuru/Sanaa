"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Film, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CheckboxField, TextField } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { addLesson, lessonAction } from "@/lib/services/teaching";
import { toast } from "@/lib/services/toast";
import type { DraftCourse } from "@/lib/store/schema";
import { formatDuration } from "@/lib/utils/format";

const MAX_VIDEO_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

export function LessonManager({ draft, ownerId }: { draft: DraftCourse; ownerId: string }) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [preview, setPreview] = useState(draft.lessons.length === 0);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("video/")) return setErrors({ file: "Choose a video file" });
    if (f.size > MAX_VIDEO_BYTES) return setErrors({ file: "Videos must be under 2 GB" });
    setErrors({});
    setFile(f);
    // Read the real length from the file so the teacher doesn't have to type it.
    const url = URL.createObjectURL(f);
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      if (Number.isFinite(probe.duration)) setMinutes(String(Math.max(1, Math.round(probe.duration / 60))));
      URL.revokeObjectURL(url);
    };
    probe.src = url;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setErrors({ file: "Add the lesson video" });
    // Simulated resumable upload. The real one streams straight to video hosting.
    setProgress(0);
    for (let p = 0; p <= 100; p += 10) {
      await new Promise((r) => setTimeout(r, 90));
      setProgress(p);
    }
    const res = addLesson(ownerId, draft.id, { title, minutes, preview });
    setProgress(null);
    if (!res.ok) return setErrors(res.fields ?? {});
    toast("Lesson added", { tone: "success" });
    setTitle("");
    setMinutes("");
    setPreview(false);
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  const busy = progress !== null;
  const act = (id: string, a: "up" | "down" | "delete" | "preview") => lessonAction(ownerId, draft.id, id, a);

  return (
    <div className="space-y-6">
      <ol className="divide-y divide-line overflow-hidden rounded-card border border-line">
        {draft.lessons.length === 0 && <li className="p-5 text-body text-ink-soft">No lessons yet. Add your first one below.</li>}
        {draft.lessons.map((l, i) => (
          <li key={l.id} className="flex items-center gap-3 p-3 pl-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-caption font-bold">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body font-semibold">{l.title}</span>
              <span className="text-caption text-ink-soft">{formatDuration(l.durationSec)}{l.preview && " · Free preview"}</span>
            </span>
            <IconButton label={l.preview ? "Make paid only" : "Make free preview"} variant="ghost" size="sm" onClick={() => act(l.id, "preview")}>
              {l.preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </IconButton>
            <IconButton label="Move up" variant="ghost" size="sm" disabled={i === 0} onClick={() => act(l.id, "up")}><ArrowUp className="h-4 w-4" /></IconButton>
            <IconButton label="Move down" variant="ghost" size="sm" disabled={i === draft.lessons.length - 1} onClick={() => act(l.id, "down")}><ArrowDown className="h-4 w-4" /></IconButton>
            <IconButton label="Delete lesson" variant="ghost" size="sm" onClick={() => { act(l.id, "delete"); toast("Lesson deleted"); }}><Trash2 className="h-4 w-4 text-ember" /></IconButton>
          </li>
        ))}
      </ol>

      <form onSubmit={submit} noValidate className="space-y-5 rounded-card bg-canvas p-5 md:p-6">
        <p className="text-title font-semibold">Add a lesson</p>
        <label
          className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-line-strong bg-white px-4 py-8 text-center transition hover:border-ink"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files[0]); }}
        >
          {file ? <Film className="h-8 w-8" strokeWidth={1.4} /> : <UploadCloud className="h-8 w-8" strokeWidth={1.4} />}
          <span className="text-body font-semibold">{file ? file.name : "Choose a video from your phone"}</span>
          <span className="text-caption text-ink-soft">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "MP4 or MOV, up to 2 GB. Uploads resume if your connection drops."}</span>
          <input ref={fileInput} type="file" accept="video/*" className="sr-only" onChange={(e) => pickFile(e.target.files?.[0])} disabled={busy} />
        </label>
        {errors.file && <p role="alert" className="text-caption font-medium text-ember">{errors.file}</p>}
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <TextField label="Lesson title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} maxLength={120} disabled={busy} />
          <TextField label="Minutes" type="number" inputMode="numeric" min={1} value={minutes} onChange={(e) => setMinutes(e.target.value)} error={errors.minutes} disabled={busy} />
        </div>
        <CheckboxField checked={preview} onChange={(e) => setPreview(e.target.checked)} label="Free preview: anyone can watch this lesson" disabled={busy} />
        {busy && <div><ProgressBar value={progress!} label="Upload progress" /><p className="mt-2 text-caption text-ink-soft">Uploading {progress}%… keep this page open.</p></div>}
        <Button type="submit" variant="dark" loading={busy}>{busy ? "Uploading…" : "Add lesson"}</Button>
      </form>
    </div>
  );
}
