import { RigidBody } from '@react-three/rapier'
import { Text } from '@react-three/drei'
import { useState } from 'react'
import { SCENE } from '../config'

// Coaster renders a single physics-enabled project card.
// Props:
//   position — [x, y, z] spawn position on the counter
//   project  — a project object from config { label, description, tech, url, featured }
//   onSelect — callback fired when this coaster is clicked

function Coaster({ position, project, onSelect }) {
  const { coasterW, coasterH, coasterD } = SCENE

  // Hover state — we'll use this to lift the coaster slightly on hover
  // giving the user a hint that it's interactive
  const [hovered, setHovered] = useState(false)

  return (
    <RigidBody
      type="dynamic"
      position={position}
      restitution={0.15}
      friction={0.9}        // high friction — coasters shouldn't slide much
      linearDamping={0.95}  // settles very quickly
      angularDamping={0.95}
      colliders="cuboid"
    >
      <group
        // Change cursor to pointer when hovering so user knows it's clickable
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={() => onSelect(project)}
      >

        {/* ── Coaster body ───────────────────────────────────── */}
            {/* CylinderGeometry args: [radiusTop, radiusBottom, height, segments]
                32 segments makes it look like a smooth circle */}
            <mesh castShadow receiveShadow>
            <cylinderGeometry args={[coasterD / 2, coasterD / 2, coasterH, 32]} />
            <meshStandardMaterial
                color={hovered ? '#4A3880' : '#2A1848'}
                roughness={0.6}
                metalness={0.1}
            />
            </mesh>

            {/* ── Top face highlight ─────────────────────────────── */}
            <mesh position={[0, coasterH / 2 + 0.001, 0]}>
            <cylinderGeometry args={[coasterD / 2 - 0.03, coasterD / 2 - 0.03, 0.001, 32]} />
            <meshStandardMaterial
                color="#6A50A0"
                roughness={0.3}
                metalness={0.2}
                transparent
                opacity={0.5}
            />
            </mesh>

        {/* ── Project label ──────────────────────────────────── */}
        {/* Sits just above the top face of the coaster.
            Rotated -90deg on X so it faces upward. */}
        <Text
          position={[0, coasterH / 2 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.14}
          color="#E8D8FF"
          anchorX="center"
          anchorY="middle"
          maxWidth={coasterW - 0.1}
        >
          {project.featured ? `✦ ${project.label}` : project.label}
        </Text>

      </group>
    </RigidBody>
  )
}

export default Coaster