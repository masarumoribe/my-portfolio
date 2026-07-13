import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { WAYPOINTS, MOMENTS, toProgress } from '../config'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

const EXPLOSION_POINT = curve.getPointAt(toProgress(MOMENTS.transition.end))
console.log('explosion point:', EXPLOSION_POINT)

// Pastel colours — one per mini fairy
const MINI_COLORS = [
  '#FFB0C8', // pink
  '#B0C8FF', // blue
  '#C8FFB0', // mint
  '#FFD8A0', // peach
  '#D8B0FF', // lavender
  '#A0FFD8', // teal
  '#FFB0B0', // coral
  '#B0D8FF', // sky
]

// Each mini fairy has a unique scatter direction and rest position
const SCATTER = [
    { scatter: [-3,  2, -1], rest: [-4,  2.5, -2] },
    { scatter: [ 3,  2,  1], rest: [ 4,  2.5, -1] },
    { scatter: [-2, -3,  0], rest: [-3, -2.5,  0] },
    { scatter: [ 2, -3,  0], rest: [ 3, -2.5,  1] },
    { scatter: [-3,  0,  2], rest: [-3.5, 0.5,  2] },
    { scatter: [ 3,  0, -2], rest: [ 3.5, 0.5, -2] },
    { scatter: [ 0,  3,  0], rest: [ 0.5,  4,  -1] },
    { scatter: [ 0, -4,  1], rest: [ 0.5, -3.5,  1] },
  ]

// A single mini fairy with its own trail and spring animation
function MiniFairy({ index, origin, scattered, converging, color, scaleF }) {
  const meshRef = useRef()
  const phase = useRef(Math.random() * Math.PI * 2) // random phase offset

  useFrame(() => {
    if (!meshRef.current) return
    phase.current += 0.02

    // Gentle individual drift when scattered
    meshRef.current.position.x += Math.sin(phase.current * 0.7 + index) * 0.002
    meshRef.current.position.y += Math.cos(phase.current * 0.5 + index) * 0.002
  })

  const scatter = SCATTER[index]

  // Three states:
  // 1. Not yet scattered — sit at origin (explosion point)
  // 2. Scattered — fly to scatter position
  // 3. Converging — return back toward origin
  const targetPos = converging
    ? [origin.x, origin.y, origin.z]
    : scattered
      ? [origin.x + scatter.rest[0] * scaleF, origin.y + scatter.rest[1] * scaleF, origin.z + scatter.rest[2] * scaleF]
      : [origin.x, origin.y, origin.z]

  const { position, scale } = useSpring({
    position: targetPos,
    scale:    scattered && !converging ? 1 : 0,
    delay:    index * 100,  // stagger the explosion outward
    config: {
      mass:     1.5,
      tension:  40,        // slow and floaty
      friction: 18,
    }
  })

  return (
    <animated.group position={position} scale={scale}>
      <Trail
        width={0.6}
        length={6}
        color={new THREE.Color(color)}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive={color}
            emissiveIntensity={3}
            toneMapped={false}
          />
          <pointLight
            color={color}
            intensity={3}
            distance={3}
            decay={2}
          />
        </mesh>
      </Trail>
    </animated.group>
  )
}

// Explosion manages all mini fairies and tracks the transition state
function Explosion({ progressRef }) {
  const [scattered,  setScattered]  = useState(false)
  const [converging, setConverging] = useState(false)
  const originRef   = useRef(EXPLOSION_POINT.clone())
  const wasScattered  = useRef(false)
  const wasConverging = useRef(false)
  const { viewport } = useThree()
  const scaleF = THREE.MathUtils.clamp(viewport.width / 16, 0.4, 1.0)

  useFrame(() => {
    const p = progressRef.current
    const { transition, projects } = MOMENTS

    // Update origin to where the fairy exploded from
    if (p >= transition.start) {
      originRef.current.copy(
        curve.getPointAt(THREE.MathUtils.clamp(transition.end, 0, 1))
      )
    }

    const shouldScatter  = p >= toProgress(MOMENTS.transition.end) && p < toProgress(MOMENTS.projects.end) - 0.05
    const shouldConverge = p >= toProgress(MOMENTS.projects.end) - 0.05 && p <= toProgress(MOMENTS.projects.end)

    if (shouldScatter !== wasScattered.current) {
      wasScattered.current = shouldScatter
      setScattered(shouldScatter)
    }
    if (shouldConverge !== wasConverging.current) {
      wasConverging.current = shouldConverge
      setConverging(shouldConverge)
    }
  })

  return (
    <>
      {MINI_COLORS.map((color, i) => (
        <MiniFairy
          key={i}
          index={i}
          origin={originRef.current}
          scattered={scattered}
          converging={converging}
          color={color}
          scaleF={scaleF}
        />
      ))}
    </>
  )
}

export default Explosion