"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";
import { Maximize, Minimize, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const DEMO_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

type Props = { src?: string; watermark: string; dataSaver: boolean; onDataSaverChange: (v: boolean) => void; onEnded?: () => void };

/**
 * Adaptive video player. Data saver caps quality at 360p. A moving watermark with the
 * learner's email discourages screen recording. Downloads and picture-in-picture are off.
 */
export function VideoPlayer({ src = DEMO_STREAM, watermark, dataSaver, onDataSaverChange, onEnded }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const hls = useRef<Hls | null>(null);
  const [pos, setPos] = useState({ top: 12, left: 8 });
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);
  const dataSaverRef = useRef(dataSaver);

  useEffect(() => {
    dataSaverRef.current = dataSaver;
    if (hls.current) applyCap(hls.current, dataSaver);
  }, [dataSaver]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    let cancelled = false;
    setFailed(false);
    (async () => {
      const { default: HlsLib } = await import("hls.js");
      if (cancelled) return;
      if (HlsLib.isSupported()) {
        const instance = new HlsLib({ capLevelToPlayerSize: true, startLevel: 0, maxBufferLength: 20 });
        hls.current = instance;
        instance.on(HlsLib.Events.MANIFEST_PARSED, () => applyCap(instance, dataSaverRef.current));
        instance.on(HlsLib.Events.ERROR, (_e, data) => data.fatal && setFailed(true));
        instance.loadSource(src);
        instance.attachMedia(el);
      } else if (el.canPlayType("application/vnd.apple.mpegurl")) {
        el.src = src;
      } else {
        setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      hls.current?.destroy();
      hls.current = null;
    };
  }, [src]);

  useEffect(() => {
    const t = setInterval(() => setPos({ top: 8 + Math.random() * 70, left: 4 + Math.random() * 56 }), 8000);
    const onFs = () => setFullscreen(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      clearInterval(t);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  function toggleFullscreen() {
    const el = wrap.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) return void document.exitFullscreen();
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => v?.webkitEnterFullscreen?.());
    else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else v?.webkitEnterFullscreen?.();
  }

  return (
    <div>
      <div ref={wrap} className="relative bg-black" onContextMenu={(e) => e.preventDefault()}>
        <video
          ref={video}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          className={cn("w-full bg-black", fullscreen ? "h-full" : "aspect-video")}
          onEnded={onEnded}
          aria-label="Lesson video"
        />
        <span aria-hidden className="pointer-events-none absolute select-none text-[11px] font-semibold text-white/35 transition-all duration-[1500ms]" style={{ top: `${pos.top}%`, left: `${pos.left}%` }}>
          {watermark}
        </span>
        <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit full screen" : "Full screen"} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70">
          {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center text-body text-white">
            This video couldn't load. Check your connection and try again.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-3 md:px-0">
        <button
          type="button"
          onClick={() => onDataSaverChange(!dataSaver)}
          aria-pressed={dataSaver}
          className={cn("inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-caption font-semibold transition", dataSaver ? "bg-malachite text-white" : "bg-canvas text-ink hover:bg-line")}
        >
          {dataSaver ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
          Data saver {dataSaver ? "on" : "off"}
        </button>
        <span className="text-caption text-ink-soft">{dataSaver ? "Playing up to 360p" : "Best quality for your connection"}</span>
      </div>
    </div>
  );
}

function applyCap(instance: Hls, on: boolean) {
  if (!on) {
    instance.autoLevelCapping = -1;
    return;
  }
  let cap = 0;
  instance.levels.forEach((l, i) => {
    if (l.height && l.height <= 360) cap = i;
  });
  instance.autoLevelCapping = cap;
  if (instance.currentLevel > cap) instance.nextLevel = cap;
}
