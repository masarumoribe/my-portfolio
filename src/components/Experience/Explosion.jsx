import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { WAYPOINTS, MOMENTS, toProgress } from '../config'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

// Calculate explosion point once — using toProgress so it's always 0-1
const EXPLOSION_POINT = curve.getPointAt(toProgress(MOMENTS.transition.end))
// Calculate where the fairy will be at the start of the about section
const CONVERGE_POINT = curve.getPointAt(toProgress(MOMENTS.about.start))

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

function MiniFairy({ index, originX, originY, originZ, convergeX, convergeY, convergeZ, scattered, converging, done, color, scaleF }) {
  const meshRef = useRef()
  const phase   = useRef(Math.random() * Math.PI * 2)

  useFrame(() => {
    if (!meshRef.current) return
    phase.current += 0.02
    meshRef.current.position.x += Math.sin(phase.current * 0.7 + index) * 0.002
    meshRef.current.position.y += Math.cos(phase.current * 0.5 + index) * 0.002
  })

  const scatter = SCATTER[index]

  const restPos   = [
    originX + scatter.rest[0] * scaleF,
    originY + scatter.rest[1] * scaleF,
    originZ + scatter.rest[2] * scaleF,
  ]
  const originPos = [originX, originY, originZ]

  // When scattered — spread from explosion point
  // When converging — fly toward where the fairy will reappear
  const targetPos = done
  ? [convergeX, convergeY, convergeZ]  // stay at converge point when done
  : converging
    ? [convergeX, convergeY, convergeZ]
    : scattered
      ? restPos
      : [originX, originY, originZ]

  const { position, scale } = useSpring({
    position: targetPos,
    scale:    done ? 0 : scattered || converging ? 1 : 0,
    delay:    done ? 0 : index * 200,  // no delay when hiding — instant
    config:   done
      ? { mass: 1, tension: 200, friction: 30 }  // fast collapse when done
      : { mass: 1.5, tension: 40, friction: 18 }, // slow float otherwise
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
        </mesh>
      </Trail>
    </animated.group>
  )
}

function Explosion({ progressRef }) {
  const [scattered,  setScattered]  = useState(false)
  const [converging, setConverging] = useState(false)
  const [done, setDone] = useState(false)
  const wasScattered  = useRef(false)
  const wasConverging = useRef(false)
  const wasDone = useRef(false)

  // In Explosion.jsx — temporary
  console.log('EXPLOSION_POINT:', EXPLOSION_POINT)
  console.log('X should be close to 0 for center screen')

  // Initialize to the actual explosion point — never [0,0,0]
  const originRef = useRef(EXPLOSION_POINT.clone())

  const { viewport } = useThree()
  const scaleF = THREE.MathUtils.clamp(viewport.width / 16, 0.4, 1.0)

  useFrame(() => {
    const p = progressRef.current
  
    const convergeStart = toProgress(MOMENTS.projects.end + 500)
    const convergeEnd   = toProgress(MOMENTS.about.start)
  
    const shouldScatter  = p >= toProgress(MOMENTS.transition.end) &&
                           p <  convergeStart
    const shouldConverge = p >= convergeStart && p < convergeEnd
    const shouldBeDone   = p >= convergeEnd
  
    if (shouldScatter !== wasScattered.current) {
      wasScattered.current = shouldScatter
      setScattered(shouldScatter)
    }
    if (shouldConverge !== wasConverging.current) {
      wasConverging.current = shouldConverge
      setConverging(shouldConverge)
    }
    if (shouldBeDone !== wasDone.current) {
      wasDone.current = shouldBeDone
      setDone(shouldBeDone)
    }
  })

  return (
    <>
      {MINI_COLORS.map((color, i) => (
        <MiniFairy
          key={i}
          index={i}
          originX={EXPLOSION_POINT.x}
          originY={EXPLOSION_POINT.y}
          originZ={EXPLOSION_POINT.z}
          convergeX={CONVERGE_POINT.x}
          convergeY={CONVERGE_POINT.y}
          convergeZ={CONVERGE_POINT.z}
          scattered={scattered}
          converging={converging}
          done={done}
          color={color}
          scaleF={scaleF}
        />
      ))}
    </>
  )
}

export default Explosion