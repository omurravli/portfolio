"use client";

import { useFrame } from "@react-three/fiber";
import { useNormalizedPointer } from "@/lib/hooks";

/**
 * Slow parallax rig: the camera drifts toward the pointer and idles on a
 * gentle sine bob, always looking back at the core.
 */
export default function CameraRig({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const pointer = useNormalizedPointer();

  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    const targetX = pointer.current.x * 0.55;
    const targetY = pointer.current.y * 0.35 + Math.sin(t * 0.25) * 0.12;
    const ease = 1 - Math.pow(0.0015, delta);
    state.camera.position.x += (targetX - state.camera.position.x) * ease;
    state.camera.position.y += (targetY - state.camera.position.y) * ease;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
