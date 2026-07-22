import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WAYPOINTS, MOMENTS, toProgress, LANTERN_WORLD_POS } from '../../config'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

function Lantern({ fairyRef, progressRef, onFairyEnter }) {
  const lanternRef    = useRef()
  const glowRef       = useRef()
  const lightRef      = useRef()
  const fairyEntered  = useRef(false)
  const flickerPhase  = useRef(Math.random() * Math.PI * 2)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const p = progressRef.current
    const contactStart = toProgress(MOMENTS.contact.start)
    const contactEnd   = toProgress(MOMENTS.contact.end)

    if (!lanternRef.current) return

    // Lantern appears as contact section starts
    const lanternVisible = p >= contactStart && p <= contactEnd
    lanternRef.current.visible = lanternVisible

    if (!lanternVisible) return

    // Gentle lantern sway
    lanternRef.current.rotation.z = Math.sin(t * 0.6) * 0.04

    // Flicker effect — random noise on emissive intensity
    flickerPhase.current += 0.01
    const baseFlicker  = Math.sin(flickerPhase.current * 1.3)
    const noiseFlicker = Math.random() * 0.08
    const flicker      = baseFlicker + noiseFlicker

    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = flicker
      glowRef.current.material.opacity = 0.3 + flicker * 0.2
    }

    if (lightRef.current) {
      lightRef.current.intensity = flicker * 4
    }

    // Check if fairy is close enough to enter lantern
    if (fairyRef?.current && !fairyEntered.current) {
      const fairyPos  = new THREE.Vector3()
      fairyRef.current.getWorldPosition(fairyPos)
      const dist = fairyPos.distanceTo(
        new THREE.Vector3(LANTERN_WORLD_POS.x, LANTERN_WORLD_POS.y, LANTERN_WORLD_POS.z)
      )
      if (dist < 0.5) {
        fairyEntered.current = true
        onFairyEnter?.()
      }
    }

    // Reset when scrolling back
    if (p < contactStart) {
      fairyEntered.current = false
    }
  })

  const W = 0.45  // lantern width
  const H = 0.7   // lantern height
  const D = 0.45  // lantern depth
  const WOOD = '#3A2010'
  const AMBER = '#FF9020'

  return (
    <group
      ref={lanternRef}
      position={[LANTERN_WORLD_POS.x, LANTERN_WORLD_POS.y + 1.5, LANTERN_WORLD_POS.z]}
      visible={false}
    >
      {/* Hanging rope */}
      <mesh position={[0, H / 2 + 0.9, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.8, 6]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, H / 2, 0]}>
        <boxGeometry args={[W + 0.06, 0.06, D + 0.06]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -H / 2, 0]}>
        <boxGeometry args={[W + 0.06, 0.06, D + 0.06]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>

      {/* Four vertical corner posts */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * W / 2, 0, sz * D / 2]}>
          <boxGeometry args={[0.04, H, 0.04]} />
          <meshStandardMaterial color={WOOD} roughness={0.8} />
        </mesh>
      ))}

      {/* Four amber glass panels */}
      {[
        { pos: [0, 0, D / 2],  rot: [0, 0, 0] },
        { pos: [0, 0, -D / 2], rot: [0, Math.PI, 0] },
        { pos: [W / 2, 0, 0],  rot: [0, Math.PI / 2, 0] },
        { pos: [-W / 2, 0, 0], rot: [0, -Math.PI / 2, 0] },
      ].map((panel, i) => (
        <mesh key={i} position={panel.pos} rotation={panel.rot} ref={i === 0 ? glowRef : null}>
          <planeGeometry args={[i < 2 ? W : D, H]} />
          <meshStandardMaterial
            color={AMBER}
            emissive={AMBER}
            emissiveIntensity={0.7}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Inner glow light */}
      <pointLight
        ref={lightRef}
        color="#FF9020"
        intensity={3}
        distance={4}
        decay={2}
      />

      {/* Tassel */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={i} position={[x, -H / 2 - 0.15, 0]}>
          <cylinderGeometry args={[0.008, 0.003, 0.2, 4]} />
          <meshStandardMaterial color="#C87020" roughness={0.9} />
        </mesh>
      ))}

    </group>
  )
}

function Contact({ progressRef, fairyRef }) {
  return (
    <Lantern
      progressRef={progressRef}
      fairyRef={fairyRef}
    />
  )
}

export default Contact