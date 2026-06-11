import { RigidBody } from '@react-three/rapier'
import { COLORS, SCENE } from '../config'

function Bar() {
  const { counterY, counterH, shelf1Y, shelf2Y, shelfW, shelfH, roomWidth } = SCENE

  return (
    <group>

      {/* ── Counter top ──────────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.8} restitution={0.2}>
        <mesh
          position={[0, counterY - counterH / 2, 0]}
          receiveShadow
        >
          <boxGeometry args={[roomWidth, counterH, 2]} />
          <meshStandardMaterial color={COLORS.counterTop} />
        </mesh>
      </RigidBody>

      {/* ── Counter front face ───────────────────────────────── */}
      {/* Moved forward on Z (-0.6 instead of -0.8) so it doesn't
          share a plane with the counter top's back edge */}
      <mesh position={[0, counterY - 1.3, -0.6]}>
        <boxGeometry args={[roomWidth, 2.4, 0.25]} />
        <meshStandardMaterial color={COLORS.counter} />
      </mesh>

      {/* ── Shelf 1 (top) ────────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.7} restitution={0.3}>
        <mesh
          position={[0, shelf1Y, -1.5]}
          receiveShadow
        >
          <boxGeometry args={[shelfW, shelfH, 0.5]} />
          <meshStandardMaterial color={COLORS.shelf} />
        </mesh>
      </RigidBody>

      {/* ── Shelf 2 (middle) ─────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.7} restitution={0.3}>
        <mesh
          position={[0, shelf2Y, -1.5]}
          receiveShadow
        >
          <boxGeometry args={[shelfW * 0.78, shelfH, 0.5]} />
          <meshStandardMaterial color={COLORS.shelf} />
        </mesh>
      </RigidBody>

      {/* ── Floor ────────────────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.9} restitution={0.1}>
        <mesh position={[0, -4, 0]} receiveShadow>
          <boxGeometry args={[roomWidth, 0.2, 8]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
      </RigidBody>

      {/* ── Back wall ────────────────────────────────────────── */}
      {/* Pushed back to -2.8 — clear of all shelf Z positions */}
      <mesh position={[0, 1, -2.8]}>
        <boxGeometry args={[roomWidth, 8, 0.2]} />
        <meshStandardMaterial color={COLORS.wall} />
      </mesh>

      {/* ── Left wall ────────────────────────────────────────── */}
      <RigidBody type="fixed">
        <mesh position={[-roomWidth / 2, 0, 0]}>
          <boxGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
      </RigidBody>

      {/* ── Right wall ───────────────────────────────────────── */}
      <RigidBody type="fixed">
        <mesh position={[roomWidth / 2, 0, 0]}>
          <boxGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
      </RigidBody>

    </group>
  )
}

export default Bar