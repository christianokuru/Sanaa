"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload as UploadIcon, Loader2, Video } from "lucide-react";
import { addLesson, createVideoUpload } from "@/lib/actions/teach";

export function LessonUploader({ courseId, videoReady }: { courseId: string; videoReady: boolean }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 2) return setError("Give the lesson a title.");
    if (videoReady && !file) return setError("Choose a video.");
    try {
      let videoId: string | null = null;
      if (videoReady && file) {
        setProgress(0);
        const up = await createVideoUpload(courseId, title);
        if (!up) throw new Error("Video uploads are not set up.");
        const { Upload } = await import("tus-js-client");
        // Resumable upload straight to Bunny: survives weak connections.
        await new Promise<void>((resolve, reject) => {
          const upload = new Upload(file, {
            endpoint: up.endpoint,
            retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
            chunkSize: 5 * 1024 * 1024,
            headers: {
              AuthorizationSignature: up.signature,
              AuthorizationExpire: String(up.expires),
              VideoId: up.videoId,
              LibraryId: up.libraryId,
            },
            metadata: { filetype: file.type, title },
            onError: reject,
            onProgress: (sent, total) => setProgress(Math.round((sent / total) * 100)),
            onSuccess: () => resolve(),
          });
          upload.findPreviousUploads().then((prev) => {
            if (prev.length) upload.resumeFromPreviousUpload(prev[0]);
            upload.start();
          });
        });
        videoId = up.videoId;
      }
      await addLesson({ courseId, title, videoId, isPreview: preview });
      setTitle("");
      setFile(null);
      setPreview(false);
      if (fileInput.current) fileInput.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Check your connection and try again.");
    } finally {
      setProgress(null);
    }
  }

  const busy = progress !== null;

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <p className="font-bold">Add a lesson</p>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" className="input" disabled={busy} />
      {videoReady ? (
        <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-earth/20 px-4 py-3">
          <Video className="h-5 w-5 text-terracotta" />
          <span className="flex-1 truncate text-sm">{file ? file.name : "Choose video from your phone"}</span>
          <input ref={fileInput} type="file" accept="video/*" className="hidden" disabled={busy} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
      ) : (
        <p className="rounded-xl bg-gold-light p-3 text-sm">Video uploads need Bunny Stream set up. You can add lesson titles now.</p>
      )}
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} className="h-5 w-5 accent-terracotta" disabled={busy} />
        Free preview (anyone can watch this lesson)
      </label>
      {busy && (
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-sand"><div className="h-full bg-forest transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="mt-1 text-xs text-earth-soft">Uploading {progress}%. Keep this page open. If your connection drops, choose the same file again to continue.</p>
        </div>
      )}
      {error && <p className="text-sm text-terracotta-dark">{error}</p>}
      <button type="submit" disabled={busy} className="btn-dark w-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
        {busy ? "Uploading..." : "Add lesson"}
      </button>
    </form>
  );
}
