import { RigidBody } from '@react-three/rapier'
import { Text } from '@react-three/drei'
import { SCENE } from '../config'

// Bottle renders a single physics-enabled skill bottle.
// Props:
//   position — [x, y, z] where it spawns
//   color    — the glass tint colour from config
//   label    — the skill name shown on the label

function Bottle({ position, color, label }) {
  const { bottleH, bottleR } = SCENE

  return (
    // RigidBody type="dynamic" means this object is fully simulated —
    // it falls, collides, bounces. restitution controls bounciness (0–1),
    // friction controls how much it slides on surfaces.
    <RigidBody
      type="dynamic"
      position={position}
      restitution={0.2}
      friction={0.8}
      colliders="hull"
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <group>

        {/* ── Bottle body ──────────────────────────────────── */}
        {/* CylinderGeometry args: [radiusTop, radiusBottom, height, segments]
            More segments = rounder cylinder. 12 is enough for a bottle. */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[bottleR, bottleR * 1.1, bottleH, 12]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.85}         // slight transparency for glass look
            roughness={0.1}        // low roughness = shiny surface
            metalness={0.0}
          />
        </mesh>

        {/* ── Bottle neck ──────────────────────────────────── */}
        {/* Positioned at the top of the body, narrower and shorter */}
        <mesh
          position={[0, bottleH * 0.55, 0]}
          castShadow
        >
          <cylinderGeometry args={[bottleR * 0.45, bottleR * 0.7, bottleH * 0.25, 12]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.85}
            roughness={0.1}
          />
        </mesh>

        {/* ── Cork ─────────────────────────────────────────── */}
        {/* Small cylinder sitting on top of the neck */}
        <mesh position={[0, bottleH * 0.7, 0]}>
          <cylinderGeometry args={[bottleR * 0.38, bottleR * 0.38, bottleH * 0.08, 8]} />
          <meshStandardMaterial color="#C8A870" roughness={0.9} />
        </mesh>

        {/* ── Label background ─────────────────────────────── */}
        {/* A flat box sitting on the front face of the bottle */}
        <mesh position={[0, 0, bottleR + 0.01]}>
          <boxGeometry args={[bottleR * 2.2, bottleH * 0.35, 0.01]} />
          <meshStandardMaterial color="#F5ECD8" roughness={0.8} />
        </mesh>

        {/* ── Label text ───────────────────────────────────── */}
        {/* Text from drei renders a 3D text mesh.
            fontSize is in Three.js units.
            anchorX/Y centers the text on its position. */}
        <Text
          position={[0, 0, bottleR + 0.03]}
          fontSize={0.13}
          color="#2A1808"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>

      </group>
    </RigidBody>
  )
}

export default Bottle