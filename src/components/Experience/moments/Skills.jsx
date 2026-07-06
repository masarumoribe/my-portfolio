import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { SKILLS, MOMENTS, WAYPOINTS } from '../../config'
import CSSBottle    from '../../models/CSSBottle'
import HTMLBottle   from '../../models/HTMLBottle'
import JSBottle     from '../../models/JSBottle'
import NodeBottle   from '../../models/NodeBottle'
import PythonBottle from '../../models/PythonBottle'
import ReactBottle  from '../../models/ReactBottle'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

const BOTTLE_COMPONENTS = {
  'React':  ReactBottle,
  'Node':   NodeBottle,
  'Python': PythonBottle,
  'JS':     JSBottle,
  'HTML':   HTMLBottle,
  'CSS':    CSSBottle,
}

// Unique entry, rest, exit and scale directions per bottle index
const BOTTLE_DIRECTIONS = [
  { enter: [-5, -3,  0], rest: [1.5, 0.3, -2], exit: [ 4,  3,  2], scale: 2.0 },
  { enter: [ 5, -2,  1], rest: [ 1.5, -0.1, -2], exit: [-3,  4, -1], scale: 1.5 },
  { enter: [ 0, -5,  0], rest: [1.8,  0.5, -3], exit: [ 3, -4,  2], scale: 1.8 },
  { enter: [-4,  3, -1], rest: [ 0.8,  0.5, -3], exit: [ 0, -5,  1], scale: 1.8 },
  { enter: [ 4,  2,  1], rest: [-1.2, -0.1, -4], exit: [-4,  2, -2], scale: 2.5 },
  { enter: [ 0,  4,  0], rest: [ -1.3, 0.3, -4], exit: [ 0, -4,  0], scale: 2.1 },
]
  
  function SingleBottle({ skill, index, progressRef, windowStart, windowEnd, centerPosRef }) {
    const BottleModel = BOTTLE_COMPONENTS[skill.label]
    const [visible, setVisible] = useState(false)
    const wasVisible = useRef(false)
    // Track whether we're entering or have passed — determines exit direction
    const hasPeaked = useRef(false)
  
    const directions = BOTTLE_DIRECTIONS[index % BOTTLE_DIRECTIONS.length]
  
    useFrame(() => {
      const p = progressRef.current
      const shouldBeVisible = p >= windowStart && p <= windowEnd
  
      // Track whether progress has passed the midpoint of this window
      // so we know which exit direction to use
      const mid = (windowStart + windowEnd) / 2
      if (p > mid) hasPeaked.current = true
      if (p < windowStart) hasPeaked.current = false
  
      if (shouldBeVisible !== wasVisible.current) {
        wasVisible.current = shouldBeVisible
        setVisible(shouldBeVisible)
      }
    })
  
    if (!BottleModel) return null
  
    const cx = centerPosRef.current.x
    const cy = centerPosRef.current.y
    const cz = centerPosRef.current.z
  
    // Entry position — unique direction per bottle
    const enterPos = [
      cx + directions.enter[0],
      cy + directions.enter[1],
      cz + directions.enter[2],
    ]

    // Rest position uses its own unique offset per bottle
    const restPos = [
      cx + directions.rest[0],
      cy + directions.rest[1],
      cz + directions.rest[2],
    ]
  
    // Exit position — different direction from entry
    const exitPos = [
      cx + directions.exit[0],
      cy + directions.exit[1],
      cz + directions.exit[2],
    ]
  
    // Determine current target position
    // If visible → rest position
    // If not visible and has peaked → exit direction
    // If not visible and hasn't peaked yet → entry direction
    const targetPos = visible
      ? restPos
      : hasPeaked.current
        ? exitPos
        : enterPos
  
    const { position, rotation, scale } = useSpring({
      position: targetPos,
      rotation: visible ? [0, Math.PI * 2, 0] : [0, 0, 0],
      scale:    visible ? directions.scale : 0.01,
      config:   { mass: 2, tension: 50, friction: 22 },
    })
  
    return (
      <animated.group position={position} rotation={rotation} scale={scale}>
        <BottleModel />
      </animated.group>
    )
  }

function Skills({ progressRef }) {
  const { start, end } = MOMENTS.skills
  const centerPos = useRef(new THREE.Vector3())

  // Divide the Skills progress range evenly between all bottles.
  // Each bottle gets an equal slice — a window it's visible within.
  // Small overlap (0.01) so there's never a gap where nothing shows.
  const sliceSize = (end - start) / SKILLS.length
  const gap = 0.01

  useFrame(() => {
    const p = progressRef.current
    centerPos.current.copy(
      curve.getPointAt(THREE.MathUtils.clamp(p, 0, 1))
    )
  })

  return (
    <>
      {SKILLS.map((skill, i) => {
        const windowStart = start + i * sliceSize
        const windowEnd   = windowStart + sliceSize - gap

        return (
          <SingleBottle
            key={skill.label}
            skill={skill}
            index={i}
            progressRef={progressRef}
            windowStart={windowStart}
            windowEnd={windowEnd}
            centerPosRef={centerPos}
          />
        )
      })}
    </>
  )
}

export default Skills