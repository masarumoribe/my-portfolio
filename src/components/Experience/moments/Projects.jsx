import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { PROJECTS, MOMENTS, WAYPOINTS, toProgress } from '../../config'
import CocktailBarBrain  from '../../models/CocktailBarBrain'
import CocktailPortfolio from '../../models/CocktailPortfolio'
import CocktailChikaHula from '../../models/CocktailChikaHula'
import CocktailSarau     from '../../models/CocktailSarau'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

// Map each project to its cocktail model component
const COCKTAIL_COMPONENTS = [
  CocktailBarBrain,
  CocktailPortfolio,
  CocktailChikaHula,
  CocktailSarau,
]

// Scattered positions relative to explosion center
// Deliberately asymmetric so they feel naturally placed
// Base positions — will be scaled by viewport width
const COCKTAIL_POSITIONS = [
  [-1.4,  1.9, -1.5],  // left high
  [ 2.6,  1.5, -2.0],  // right high
  [-1.8, -1.0, -2.5],  // left low
  [ 2.8, -1.9, -1.8],  // right low
]

const COCKTAIL_SCALES = [0.8, 0.9, 0.85, 0.75]

// SingleCocktail handles one cocktail's animation and hover state
function SingleCocktail({ index, project, isVisible, origin, onHover, onUnhover, scale, scaleF }) {
  const CocktailModel = COCKTAIL_COMPONENTS[index]
  const groupRef      = useRef()
  const innerRef      = useRef()

  // Idle rotation
  useFrame(({ clock }) => {
    if (!innerRef.current) return
    innerRef.current.rotation.y = clock.getElapsedTime() * 0.4 + index * Math.PI * 0.5
  })

  const offset  = COCKTAIL_POSITIONS[index]
  const finalPos = [
    origin.x + offset[0] * scaleF,
    origin.y + offset[1] * scaleF,
    origin.z + offset[2],
  ]
  const hiddenPos = [
    origin.x + offset[0] * 3 * scaleF,
    origin.y - 5,
    origin.z + offset[2],
  ]

  // Also scale down the model itself on small screens
  const responsiveScale = scale * scaleF

  const { position, springScale } = useSpring({
    position:    isVisible ? finalPos : hiddenPos,
    springScale: isVisible ? responsiveScale : 0,
    delay:       index * 180,
    config:      { mass: 2, tension: 45, friction: 22 },
  })

  return (
    <animated.group
      ref={groupRef}
      position={position}
      scale={springScale}
    >
      <group
        ref={innerRef}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          onHover(project)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          onUnhover()
        }}
      >
        <CocktailModel />
      </group>
    </animated.group>
  )
}

// Projects manages all cocktails and the hover state
function Projects({ progressRef, onProjectHover, onProjectUnhover }) {
  const [visible, setVisible] = useState(false)
  const wasVisible = useRef(false)
  const originRef = useRef(new THREE.Vector3())
  const { viewport } = useThree()

  // Scale factor — same approach as mini fairies
  // Keeps cocktails within view on any screen size
  const scaleF = THREE.MathUtils.clamp(viewport.width / 14, 0.45, 1.0)

  useFrame(() => {
    const p      = progressRef.current
    const start  = toProgress(MOMENTS.projects.start - 200)
    const end    = toProgress(MOMENTS.projects.end)

    const shouldBeVisible = p >= start && p <= end

    if (shouldBeVisible !== wasVisible.current) {
      wasVisible.current = shouldBeVisible
      setVisible(shouldBeVisible)
    }

    // Keep origin at explosion point
    originRef.current.copy(
      curve.getPointAt(
        THREE.MathUtils.clamp(toProgress(MOMENTS.transition.end), 0, 1)
      )
    )
  })

  return (
    <>
      {PROJECTS.map((project, i) => (
        <SingleCocktail
          key={project.label}
          index={i}
          project={project}
          isVisible={visible}
          origin={originRef.current}
          scale={COCKTAIL_SCALES[i]}
          scaleF={scaleF}
          onHover={onProjectHover}
          onUnhover={onProjectUnhover}
        />
      ))}
    </>
  )
}

export default Projects