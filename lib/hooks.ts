"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the pointer in normalized device coordinates (-1..1, +y = up)
 * via a window listener, so it keeps working even when overlays sit
 * above the WebGL canvas. Returned as a ref — reading it never re-renders.
 */
export function useNormalizedPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}
