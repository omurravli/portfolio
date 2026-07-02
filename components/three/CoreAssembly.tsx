"use client";

import { Html, Line, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useNormalizedPointer } from "@/lib/hooks";

interface MotionProps {
  reducedMotion: boolean;
}

/* ------------------------------------------------------------------ */
/* Discipline labels orbiting the core                                  */
/* ------------------------------------------------------------------ */

const LABELS = [
  { text: "AI", color: "#22d3ee", angle: 0.0, y: 1.15 },
  { text: "IOT", color: "#a78bfa", angle: 0.9, y: -0.55 },
  { text: "ROBOTICS", color: "#38bdf8", angle: 1.8, y: 0.8 },
  { text: "FLUTTER", color: "#e879f9", angle: 2.7, y: -1.05 },
  { text: "WEB", color: "#22d3ee", angle: 3.6, y: 0.45 },
  { text: "DRONES", color: "#a78bfa", angle: 4.5, y: -0.8 },
  { text: "OPTIMIZATION", color: "#38bdf8", angle: 5.4, y: 1.05 },
];

function OrbitLabels({ reducedMotion }: MotionProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += delta * 0.07;
  });

  return (
    <group ref={ref}>
      {LABELS.map((label) => (
        <Html
          key={label.text}
          position={[
            Math.cos(label.angle) * 2.7,
            label.y,
            Math.sin(label.angle) * 2.7,
          ]}
          center
          distanceFactor={8.5}
          zIndexRange={[10, 0]}
          className="pointer-events-none select-none"
        >
          <div className="orbit-label" style={{ borderColor: `${label.color}44` }}>
            <span
              style={{ background: label.color, boxShadow: `0 0 8px ${label.color}` }}
            />
            {label.text}
          </div>
        </Html>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The reactor core: distorted icosahedron + wireframe cage + shell     */
/* ------------------------------------------------------------------ */

function EngineeringCore({ reducedMotion }: MotionProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.15;
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.22;
      wireRef.current.rotation.x += delta * 0.07;
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.05, 5]} />
        <MeshDistortMaterial
          color="#2b2170"
          emissive="#5b21b6"
          emissiveIntensity={0.5}
          roughness={0.18}
          metalness={0.85}
          distort={reducedMotion ? 0.15 : 0.32}
          speed={reducedMotion ? 0 : 1.6}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.42}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh scale={1.85}>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          transparent
          opacity={0.05}
          roughness={0.1}
          metalness={0.2}
          depthWrite={false}
        />
      </mesh>
      {/* inner glow */}
      <pointLight intensity={12} distance={7} color="#22d3ee" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Orbit rings with satellite nodes                                     */
/* ------------------------------------------------------------------ */

const RINGS: {
  radius: number;
  rotation: [number, number, number];
  speed: number;
  color: string;
  opacity: number;
}[] = [
  { radius: 2.2, rotation: [1.45, 0.3, 0], speed: 0.5, color: "#22d3ee", opacity: 0.4 },
  { radius: 2.75, rotation: [1.15, -0.45, 0.35], speed: -0.34, color: "#8b5cf6", opacity: 0.35 },
  { radius: 3.35, rotation: [1.75, 0.2, -0.3], speed: 0.22, color: "#a78bfa", opacity: 0.22 },
];

function Ring({
  radius,
  rotation,
  speed,
  color,
  opacity,
  reducedMotion,
}: (typeof RINGS)[number] & MotionProps) {
  const spinRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion || !spinRef.current) return;
    spinRef.current.rotation.z += delta * speed;
  });

  return (
    <group rotation={rotation}>
      <group ref={spinRef}>
        <mesh>
          <torusGeometry args={[radius, 0.012, 8, 128]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
        {/* satellite node riding the ring */}
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

function OrbitRings({ reducedMotion }: MotionProps) {
  return (
    <group>
      {RINGS.map((ring) => (
        <Ring key={ring.radius} {...ring} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Data streams: dashed curves flowing out of the core                  */
/* ------------------------------------------------------------------ */

function DataStreams({ reducedMotion }: MotionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lineRefs = useRef<any[]>([]);

  const streams = useMemo(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => {
      const a0 = (i / count) * Math.PI * 2;
      const a1 = a0 + 1.6 + (i % 3) * 0.4;
      const lift = (i % 2 === 0 ? 1 : -1) * (0.5 + (i % 3) * 0.25);
      const start = new THREE.Vector3(Math.cos(a0) * 1.2, lift * 0.25, Math.sin(a0) * 1.2);
      const mid = new THREE.Vector3(
        Math.cos((a0 + a1) / 2) * 2.6,
        lift * 1.4,
        Math.sin((a0 + a1) / 2) * 2.6
      );
      const end = new THREE.Vector3(Math.cos(a1) * 4.3, lift * 0.5, Math.sin(a1) * 4.3);
      return {
        points: new THREE.CatmullRomCurve3([start, mid, end]).getPoints(48),
        color: i % 2 === 0 ? "#8b5cf6" : "#22d3ee",
        speed: 0.4 + (i % 3) * 0.18,
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.03;
    lineRefs.current.forEach((line, i) => {
      if (line?.material) {
        line.material.dashOffset = -state.clock.elapsedTime * streams[i].speed;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <Line
          key={i}
          ref={(el: any) => {
            lineRefs.current[i] = el;
          }}
          points={stream.points}
          color={stream.color}
          lineWidth={1}
          transparent
          opacity={0.5}
          dashed
          dashSize={0.14}
          gapSize={0.5}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Mouse-reactive accent light                                          */
/* ------------------------------------------------------------------ */

function MouseLight({ reducedMotion }: MotionProps) {
  const ref = useRef<THREE.PointLight>(null);
  const pointer = useNormalizedPointer();

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    const ease = 1 - Math.pow(0.002, delta);
    ref.current.position.x += (pointer.current.x * 5 - ref.current.position.x) * ease;
    ref.current.position.y += (pointer.current.y * 3 - ref.current.position.y) * ease;
  });

  return (
    <pointLight ref={ref} position={[3, 2, 4]} intensity={55} distance={14} color="#c084fc" />
  );
}

/* ------------------------------------------------------------------ */
/* Idle bob wrapper                                                     */
/* ------------------------------------------------------------------ */

function BobGroup({
  children,
  reducedMotion,
}: MotionProps & { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reducedMotion || !ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.14;
  });

  return <group ref={ref}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/* Assembly — responsive placement handled in world units               */
/* ------------------------------------------------------------------ */

export default function CoreAssembly({ reducedMotion }: MotionProps) {
  const { viewport } = useThree();
  // Shift the core to the right of the hero copy on wide screens,
  // center + shrink it behind the copy on small ones.
  const offsetX = viewport.width > 8.4 ? Math.min(viewport.width * 0.16, 1.9) : 0;
  const scale = THREE.MathUtils.clamp(viewport.width / 10.5, 0.55, 1);

  return (
    <group position={[offsetX, 0, 0]} scale={scale}>
      <BobGroup reducedMotion={reducedMotion}>
        <EngineeringCore reducedMotion={reducedMotion} />
        <OrbitRings reducedMotion={reducedMotion} />
        <DataStreams reducedMotion={reducedMotion} />
        <OrbitLabels reducedMotion={reducedMotion} />
        <Sparkles count={55} scale={5.5} size={2} speed={reducedMotion ? 0 : 0.35} color="#a78bfa" opacity={0.55} />
      </BobGroup>
      <MouseLight reducedMotion={reducedMotion} />
    </group>
  );
}
