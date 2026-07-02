"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CameraRig from "./CameraRig";
import CoreAssembly from "./CoreAssembly";
import ParticleField from "./ParticleField";

export default function HeroScene({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={["#050509", 9.5, 17.5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 5, 6]} intensity={90} color="#8b5cf6" />
        <pointLight position={[-6, -4, 5]} intensity={65} color="#22d3ee" />
        <CoreAssembly reducedMotion={reducedMotion} />
        <ParticleField reducedMotion={reducedMotion} />
        <CameraRig reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
