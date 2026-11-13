"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { ensureDemoAccounts } from "@/lib/services/auth";

/** Loads saved device data after the first paint, so the server HTML stays cacheable. */
export function StoreHydrator() {
  useEffect(() => {
    void Promise.resolve(useAppStore.persist.rehydrate()).then(() => ensureDemoAccounts());
  }, []);
  return null;
}
