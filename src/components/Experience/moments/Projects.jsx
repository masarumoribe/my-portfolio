import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'
import { PROJECTS, MOMENTS, WAYPOINTS, toProgress } from '../../config'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

// Card positions — same as cocktail model positions
const CARD_POSITIONS = [
  [-1.4,  2.3, -1.5],
  [ 2.6,  2.7, -2.0],
  [-1.8, -1.8, -2.5],
  [ 2.8, -2.1, -1.2],
]

// Each card has a unique tilt — feels like physical cards on a table
const CARD_ROTATIONS = [
  [0.2, 0.2,  0.08],
  [-0.06,  -0.12, -0.06],
  [-0.3, 0.3,  0.1],
  [-0.16,  -0.1, -0.1],
]

const CARD_SCALES = [1.1, 1.15, 1.2, 1.1]

// Image paths — one per project in order
const CARD_IMAGES = [
  '/images/cocktail_barbrain.png',
  '/images/cocktail_portfolio.png',
  '/images/cocktail_chikahula.png',
  '/images/cocktail_sarau.png',
]

// Card dimensions in Three.js units
const CARD_W = 1.8
const CARD_H = 2.6

function MenuCard({ index, project, isVisible, origin, scaleF, onHover, onUnhover }) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()

  // Gentle floating animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.position.y += Math.sin(t * 0.8 + index * 1.2) * 0.0008
  })

  const offset   = CARD_POSITIONS[index]
  const rotation = CARD_ROTATIONS[index]

  const finalPos = [
    origin.x + offset[0] * scaleF,
    origin.y + offset[1] * scaleF,
    origin.z + offset[2],
  ]
  const hiddenPos = [
    origin.x + offset[0] * 3 * scaleF,
    origin.y - 6,
    origin.z + offset[2],
  ]

  const responsiveScale = CARD_SCALES[index] * scaleF

  const { position, springScale } = useSpring({
    position:    isVisible ? finalPos : hiddenPos,
    springScale: isVisible ? responsiveScale : 0,
    delay:       index * 120,
    config:      { mass: 2, tension: 45, friction: 22 },
  })

  // Load cocktail image as texture
  const texture = useTexture(CARD_IMAGES[index])

  return (
    <animated.group
      position={position}
      scale={springScale}
      rotation={rotation}
    >
      <group
        ref={groupRef}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          setHovered(true)
          onHover(project)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          setHovered(false)
          onUnhover()
        }}
        onPointerDown={() => {
          // On mobile, pointerDown = tap — show the card
          onHover(project)
        }}
      >
        {/* Card backing — parchment colour */}
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[CARD_W + 0.06, CARD_H + 0.06]} />
          <meshStandardMaterial
            color={hovered ? '#EDE0C4' : '#F5ECD8'}
            roughness={0.9}
            metalness={0}
          />
        </mesh>

        {/* Card border — slightly darker parchment */}
        <mesh position={[0, 0, -0.003]}>
          <planeGeometry args={[CARD_W + 0.02, CARD_H + 0.02]} />
          <meshStandardMaterial
            color="#C8A870"
            roughness={0.8}
          />
        </mesh>

        {/* Cocktail image */}
        <mesh position={[0, 0.22, 0]}>
          <planeGeometry args={[CARD_W - 0.12, CARD_H * 0.70]} />
          <meshStandardMaterial
            map={texture}
            transparent
            roughness={0.7}
            emissive="#888888"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Text area */}
        <mesh position={[0, -0.95, 0.001]}>
          <planeGeometry args={[CARD_W - 0.12, CARD_H * 0.16]} />
          <meshStandardMaterial
            color="#F5ECD8"
            roughness={0.9}
          />
        </mesh>

        <Text
          position={[0, -0.95, 0.01]}
          fontSize={0.13}
          color="#6D5310"
          anchorX="center"
          anchorY="middle"
          maxWidth={CARD_W - 0.2}
        >
          ✦ {project.menuTag} ✦
        </Text>

      </group>
    </animated.group>
  )
}

function Projects({ progressRef, onProjectHover, onProjectUnhover }) {
  const [visible, setVisible] = useState(false)
  const wasVisible            = useRef(false)
  const originRef             = useRef(new THREE.Vector3())
  const { viewport }          = useThree()

  const scaleF = THREE.MathUtils.clamp(viewport.width / 14, 0.45, 1.0)

  useFrame(() => {
    const p     = progressRef.current
    const start = toProgress(MOMENTS.projects.start - 200)
    const end   = toProgress(MOMENTS.projects.end)

    const shouldBeVisible = p >= start && p <= end
    if (shouldBeVisible !== wasVisible.current) {
      wasVisible.current = shouldBeVisible
      setVisible(shouldBeVisible)
    }

    originRef.current.copy(
      curve.getPointAt(
        THREE.MathUtils.clamp(toProgress(MOMENTS.transition.end), 0, 1)
      )
    )
  })

  return (
    <>
      {PROJECTS.map((project, i) => (
        <MenuCard
          key={project.label}
          index={i}
          project={project}
          isVisible={visible}
          origin={originRef.current}
          scaleF={scaleF}
          onHover={onProjectHover}
          onUnhover={onProjectUnhover}
        />
      ))}
    </>
  )
}

export default Projects