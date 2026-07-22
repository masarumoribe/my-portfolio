import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { SKILLS, MOMENTS, WAYPOINTS, toProgress } from '../../config'
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

const BOTTLE_DIRECTIONS = [
  { enter: [-5, -3,  0], rest: [1.8, 1, -2], exit: [ 4,  3,  2], scale: 1.3 },
  { enter: [ 5, -2,  1], rest: [ 1.5, 1, -2], exit: [-3,  4, -1], scale: 1.4 },
  { enter: [ 0, -5,  0], rest: [1.8,  0.5, -3], exit: [ 3, -4,  2], scale: 1.5 },
  { enter: [-4,  3, -1], rest: [ 2.4,  0.8, -3], exit: [ 0, -5,  1], scale: 1.6 },
  { enter: [ 4,  2,  1], rest: [0, 0.5, -4], exit: [-4,  2, -2], scale: 1.5 },
  { enter: [ 0,  4,  0], rest: [ -2.8, 0.5, -4], exit: [ 0, -4,  0], scale: 1.4 },
]

function SingleBottle({ skill, index, progressRef, windowStart, windowEnd, centerPosRef }) {
  const BottleModel  = BOTTLE_COMPONENTS[skill.label]
  const [visible, setVisible] = useState(false)
  const wasVisible   = useRef(false)
  const hasPeaked    = useRef(false)
  const directions   = BOTTLE_DIRECTIONS[index % BOTTLE_DIRECTIONS.length]

  useFrame(() => {
    const p = progressRef.current
    const shouldBeVisible = p >= windowStart && p <= windowEnd
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

  const enterPos = [cx + directions.enter[0], cy + directions.enter[1], cz + directions.enter[2]]
  const restPos  = [cx + directions.rest[0],  cy + directions.rest[1],  cz + directions.rest[2]]
  const exitPos  = [cx + directions.exit[0],  cy + directions.exit[1],  cz + directions.exit[2]]

  const targetPos = visible
    ? restPos
    : hasPeaked.current ? exitPos : enterPos

  const { position, rotation, scale } = useSpring({
    position: targetPos,
    rotation: visible ? [0, Math.PI * 2, 0] : [0, 0, 0],
    scale:    visible ? directions.scale : 0.01,
    config:   { mass: 2, tension: 50, friction: 25 },
  })

  return (
    <animated.group position={position} rotation={rotation} scale={scale}>
      <BottleModel />
    </animated.group>
  )
}

function Skills({ progressRef }) {
  const start     = toProgress(MOMENTS.skills.start)
  const end       = toProgress(MOMENTS.skills.end)
  const sliceSize = (end - start) / SKILLS.length
  const gap       = toProgress(20)
  const centerPos = useRef(new THREE.Vector3())

  useFrame(() => {
    const p = progressRef.current
    centerPos.current.copy(
      curve.getPointAt(THREE.MathUtils.clamp(p, 0, 1))
    )
  })

  return (
    <>
      {SKILLS.map((skill, i) => {
        const windowStart = start + i * sliceSize + gap / 2
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