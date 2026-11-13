"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { initialState, persistedStateSchema, type PersistedState } from "@/lib/store/schema";

/**
 * The app's device-side state. Components never write to it directly: they call the
 * functions in `src/lib/services/*`, which validate input and apply business rules.
 * When the backend is connected, those services switch to API calls.
 */
type Store = PersistedState & { hydrated: boolean };

export const STORE_KEY = "sanaa:v1";

export const useAppStore = create<Store>()(
  persist((): Store => ({ ...initialState, hydrated: false }), {
    name: STORE_KEY,
    version: 1,
    storage: createJSONStorage(() => localStorage),
    skipHydration: true,
    partialize: ({ hydrated: _hydrated, ...rest }) => rest,
    merge: (persisted, current) => {
      const parsed = persistedStateSchema.safeParse(persisted);
      return parsed.success ? { ...current, ...parsed.data } : current;
    },
    onRehydrateStorage: () => () => {
      useAppStore.setState({ hydrated: true });
    },
  }),
);

export function setStore(updater: (s: PersistedState) => Partial<PersistedState>) {
  useAppStore.setState((s) => updater(s));
}

export function getStore(): PersistedState {
  return useAppStore.getState();
}
