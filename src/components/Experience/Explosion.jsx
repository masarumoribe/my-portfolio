import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { WAYPOINTS, MOMENTS, toProgress } from '../config'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

// Calculate explosion point once — using toProgress so it's always 0-1
const EXPLOSION_POINT = curve.getPointAt(toProgress(MOMENTS.transition.end))

const MINI_COLORS = [
  '#FFB0C8', // pink
  '#B0C8FF', // blue
  '#C8FFB0', // mint
  '#FFD8A0', // peach
  '#D8B0FF', // lavender
  '#A0FFD8', // teal
  '#FFB0B0', // coral
  '#B0D8FF', // sky
  '#FFE8B0', // yellow
  '#B0FFB8', // light green
  '#FFB0F0', // magenta
  '#B8D8FF', // pale blue
]

// Must match MINI_COLORS length exactly
const SCATTER = [
  { rest: [-3.5,  2.9, -0.8] },
  { rest: [ 3.2,  2.4, -0.5] },
  { rest: [-2.5, -3.2,  0.3  ] },
  { rest: [ 2.5, -3.2,  0.5] },
  { rest: [-3.2,  1.3,  1  ] },
  { rest: [ 3.2,  1.3, -1  ] },
  { rest: [ 1.3,  3.5, -0.5] },
  { rest: [ 1.3, -3.8,  0.5] },
  { rest: [-2.0,  3.0,  1.0] },
  { rest: [ 2.0, -2.5, -1.0] },
  { rest: [-3.5, -2.0,  0.5] },
  { rest: [ 3.0,  3.0,  0.5] },
]

function MiniFairy({ index, origin, scattered, converging, color, scaleF }) {
  const meshRef = useRef()
  const phase   = useRef(Math.random() * Math.PI * 2)

  useFrame(() => {
    if (!meshRef.current) return
    phase.current += 0.02
    meshRef.current.position.x += Math.sin(phase.current * 0.7 + index) * 0.002
    meshRef.current.position.y += Math.cos(phase.current * 0.5 + index) * 0.002
  })

  const scatter = SCATTER[index]

  const targetPos = converging
    ? [origin.x, origin.y, origin.z]
    : scattered
      ? [
          origin.x + scatter.rest[0] * scaleF,
          origin.y + scatter.rest[1] * scaleF,
          origin.z + scatter.rest[2] * scaleF,
        ]
      : [origin.x, origin.y, origin.z]

  const { position, scale } = useSpring({
    position: targetPos,
    scale:    scattered && !converging ? 1 : 0,
    delay:    index * 100,
    config:   { mass: 1.5, tension: 40, friction: 18 },
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

function Explosion({ progressRef }) {
  const [scattered,  setScattered]  = useState(false)
  const [converging, setConverging] = useState(false)
  const wasScattered  = useRef(false)
  const wasConverging = useRef(false)

  // Initialize to the actual explosion point — never [0,0,0]
  const originRef = useRef(EXPLOSION_POINT.clone())

  const { viewport } = useThree()
  const scaleF = THREE.MathUtils.clamp(viewport.width / 16, 0.4, 1.0)

  useFrame(() => {
    const p = progressRef.current

    // Fix — use toProgress so curve.getPointAt gets a 0-1 value
    originRef.current.copy(
      curve.getPointAt(THREE.MathUtils.clamp(toProgress(MOMENTS.transition.end), 0, 1))
    )

    const shouldScatter  = p >= toProgress(MOMENTS.transition.end) &&
                           p <  toProgress(MOMENTS.projects.end)
    const shouldConverge = p >= toProgress(MOMENTS.projects.end) &&
                           p <= toProgress(MOMENTS.projects.end) + 0.02

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