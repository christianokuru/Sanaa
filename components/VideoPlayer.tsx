"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";
import { Maximize, Wifi, WifiOff } from "lucide-react";

const DATA_SAVER_KEY = "sanaa_datasaver";

function readDataSaver() {
  try {
    return localStorage.getItem(DATA_SAVER_KEY) === "1";
  } catch {
    return false;
  }
}

export function VideoPlayer({
  src, watermark, onEnded,
}: { src: string; watermark: string; onEnded?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [dataSaver, setDataSaver] = useState(false);
  const [pos, setPos] = useState({ top: 10, left: 10 });

  useEffect(() => setDataSaver(readDataSaver()), []);

  // Load the stream. hls.js where supported, built-in player on iPhone Safari.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    (async () => {
      const { default: HlsLib } = await import("hls.js");
      if (cancelled) return;
      if (HlsLib.isSupported()) {
        const hls = new HlsLib({ capLevelToPlayerSize: true, startLevel: 0 });
        hlsRef.current = hls;
        hls.on(HlsLib.Events.MANIFEST_PARSED, () => applyCap(hls, readDataSaver()));
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    })();
    return () => {
      cancelled = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [src]);

  // Move the watermark around so it can't be cropped out of screen recordings.
  useEffect(() => {
    const t = setInterval(() => {
      setPos({ top: 8 + Math.random() * 70, left: 5 + Math.random() * 55 });
    }, 9000);
    return () => clearInterval(t);
  }, []);

  function toggleDataSaver() {
    const next = !dataSaver;
    setDataSaver(next);
    try {
      localStorage.setItem(DATA_SAVER_KEY, next ? "1" : "0");
    } catch {}
    if (hlsRef.current) applyCap(hlsRef.current, next);
  }

  function fullscreen() {
    const wrap = wrapRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) return void document.exitFullscreen();
    if (wrap?.requestFullscreen) wrap.requestFullscreen().catch(() => video?.webkitEnterFullscreen?.());
    else if (wrap?.webkitRequestFullscreen) wrap.webkitRequestFullscreen();
    else video?.webkitEnterFullscreen?.();
  }

  return (
    <div>
      <div ref={wrapRef} className="relative bg-black" onContextMenu={(e) => e.preventDefault()}>
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload nofullscreen"
          disablePictureInPicture
          className="aspect-video w-full bg-black"
          onEnded={onEnded}
        />
        <span
          className="pointer-events-none absolute select-none text-xs font-semibold text-white/30 transition-all duration-1000"
          style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
        >
          {watermark}
        </span>
        <button
          onClick={fullscreen}
          className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white"
          aria-label="Full screen"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={toggleDataSaver}
        className={`mt-2 flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-semibold ${
          dataSaver ? "bg-forest text-white" : "bg-white text-earth shadow-card"
        }`}
      >
        {dataSaver ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
        Data saver: {dataSaver ? "On (low quality)" : "Off"}
      </button>
    </div>
  );
}

/** Data saver caps quality at 360p (or the lowest available). */
function applyCap(hls: Hls, on: boolean) {
  if (!on) {
    hls.autoLevelCapping = -1;
    return;
  }
  const levels = hls.levels;
  let cap = 0;
  levels.forEach((l, i) => {
    if (l.height && l.height <= 360) cap = i;
  });
  hls.autoLevelCapping = cap;
  if (hls.currentLevel > cap) hls.nextLevel = cap;
}
