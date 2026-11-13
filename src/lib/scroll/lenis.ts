import type Lenis from "lenis";

/** The one Lenis instance for the page, or null (server, reduced motion, before mount). */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};
export const getLenis = () => instance;
