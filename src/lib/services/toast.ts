"use client";

import { create } from "zustand";

type Toast = { id: number; message: string; tone: "default" | "success" | "error"; action?: { label: string; href: string } };

export const useToasts = create<{ toasts: Toast[] }>(() => ({ toasts: [] }));

let counter = 0;

export function toast(message: string, opts: Partial<Omit<Toast, "id" | "message">> = {}) {
  const id = ++counter;
  useToasts.setState((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, tone: opts.tone ?? "default", action: opts.action }] }));
  setTimeout(() => useToasts.setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3800);
}

export function dismissToast(id: number) {
  useToasts.setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
}
