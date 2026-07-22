import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { WAYPOINTS, MOMENTS, toProgress, LANTERN_WORLD_POS } from '../config'

// Curve is defined once outside the component —
// creating it inside would rebuild it every render
const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

function SparkleParticle({ index }) {
  const ref = useRef()
  // Each particle has a unique orbit phase and radius
  const phase  = useRef(index * (Math.PI * 2 / 8))
  const radius = 0.15 + (index % 3) * 0.08
  const speed  = 0.4 + (index % 4) * 0.1
  const yOffset = (index % 3 - 1) * 0.12

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    // Orbit slowly around center — position is relative to parent group
    ref.current.position.x = Math.cos(t * speed + phase.current) * radius
    ref.current.position.y = yOffset + Math.sin(t * speed * 0.7 + phase.current) * 0.05
    ref.current.position.z = Math.sin(t * speed + phase.current) * radius
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshStandardMaterial
        color="#E8D0FF"
        emissive="#C8A8FF"
        emissiveIntensity={2}
        transparent
        opacity={0.7}
        toneMapped={false}
      />
    </mesh>
  )
}

function Fairy({ progressRef, meshRef: externalMeshRef }) {
  const meshRef  = externalMeshRef || useRef()
  const glowRef  = useRef()
  const groupRef = useRef()
  const trail2Ref = useRef()
  const trail3Ref = useRef()
  const sparkleGroupRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const p = progressRef.current
    const { transition, about, contact } = MOMENTS
  
    const transStart   = toProgress(transition.start)
    const transEnd     = toProgress(transition.end)
    const aboutStart   = toProgress(about.start)
    const contactStart = toProgress(contact.start)
    const contactEnd   = toProgress(contact.end)

  
    // ── Visibility ──────────────────────────────────────────
    // Hide during explosion/projects only
    const shouldHide = p >= transEnd && p < aboutStart
    if (groupRef.current) groupRef.current.visible = !shouldHide
    if (shouldHide) return
  
    // ── Contact zone — fairy enters lantern ─────────────────
    if (p >= contactStart) {
      // Target — lantern position
      const targetX = LANTERN_WORLD_POS.x
      const targetY = LANTERN_WORLD_POS.y + 1.5
      const targetZ = LANTERN_WORLD_POS.z
      // Use LANTERN_POINT directly instead of curve position —
      // curve at contactStart is behind the camera
      if (meshRef.current) {
        meshRef.current.position.x = THREE.MathUtils.lerp(
          meshRef.current.position.x, targetX, 0.015
        )
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y, targetY, 0.015
        )
        meshRef.current.position.z = THREE.MathUtils.lerp(
          meshRef.current.position.z, targetZ, 0.015
        )
      }

      if (trail2Ref.current) {
        trail2Ref.current.position.set(
          meshRef.current.position.x + Math.sin(t * 2.1) * 0.08,
          meshRef.current.position.y + Math.cos(t * 1.7) * 0.08,
          meshRef.current.position.z
        )
      }
      if (trail3Ref.current) {
        trail3Ref.current.position.set(
          meshRef.current.position.x + Math.sin(t * 1.5 + 1) * 0.06,
          meshRef.current.position.y + Math.cos(t * 2.3 + 2) * 0.06,
          meshRef.current.position.z
        )
      }

      if (sparkleGroupRef.current) {
        sparkleGroupRef.current.position.x = THREE.MathUtils.lerp(
          sparkleGroupRef.current.position.x, meshRef.current.position.x, 0.05
        )
        sparkleGroupRef.current.position.y = THREE.MathUtils.lerp(
          sparkleGroupRef.current.position.y, meshRef.current.position.y, 0.05
        )
        sparkleGroupRef.current.position.z = THREE.MathUtils.lerp(
          sparkleGroupRef.current.position.z, meshRef.current.position.z, 0.05
        )
      }
    
      const enterProgress = Math.min(
        (p - contactStart) / ((contactEnd - contactStart) * 0.3),
        1
      )

      if (meshRef.current) {
        const s = Math.max(1 - enterProgress, 0.5)
        meshRef.current.scale.setScalar(s)
      }
      return
    }
  
    // ── Normal position update ───────────────────────────────
    if (groupRef.current) groupRef.current.scale.setScalar(1)
  
    const point = curve.getPointAt(THREE.MathUtils.clamp(p, 0, 1))
  
    // Organic wobble
    point.y += Math.sin(t * 1.8) * 0.06
    point.x += Math.sin(t * 1.2) * 0.03
  
    // Shaking during transition
    if (p >= transStart && p < transEnd) {
      const shakeFactor = (p - transStart) / (transEnd - transStart)
      const shakeAmt    = shakeFactor * 0.3
      point.x += (Math.random() - 0.5) * shakeAmt
      point.y += (Math.random() - 0.5) * shakeAmt
      point.z += (Math.random() - 0.5) * shakeAmt * 0.5
    }
  
    if (meshRef.current) meshRef.current.position.copy(point)

    if (trail2Ref.current) {
      trail2Ref.current.position.set(
        point.x + Math.sin(t * 1.5) * 0.08,
        point.y + Math.cos(t * 1.7) * 0.08,
        point.z
      )
    }
    if (trail3Ref.current) {
      trail3Ref.current.position.set(
        point.x + Math.sin(t * 1.5 + 1) * 0.06,
        point.y + Math.cos(t * 2.3 + 2) * 0.06,
        point.z
      )
    }

    if (sparkleGroupRef.current) {
      sparkleGroupRef.current.position.x = THREE.MathUtils.lerp(
        sparkleGroupRef.current.position.x, point.x, 0.08
      )
      sparkleGroupRef.current.position.y = THREE.MathUtils.lerp(
        sparkleGroupRef.current.position.y, point.y, 0.08
      )
      sparkleGroupRef.current.position.z = THREE.MathUtils.lerp(
        sparkleGroupRef.current.position.z, point.z, 0.08
      )
    }
  
    // Pulse
    const pulseSpeed = (p >= transStart && p < transEnd)
      ? 3 + ((p - transStart) / (transEnd - transStart)) * 8
      : 3
    const pulse = 1 + Math.sin(t * pulseSpeed) * 0.15
    if (glowRef.current) glowRef.current.scale.setScalar(pulse)
  })

  return (
    <group ref={groupRef}>
  
      {/* Main trail — thinner than before */}
      <Trail
        width={0.9}
        length={10}
        color={new THREE.Color('#C8A8FF')}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFE8C0"
            emissiveIntensity={3}
            toneMapped={false}
          />
          <pointLight color="#FFF5E8" intensity={15} distance={8} decay={2} />
  
          {/* Outer glow shell */}
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial
              color="#C8A8FF"
              emissive="#B090FF"
              emissiveIntensity={1.5}
              transparent
              opacity={0.25}
              toneMapped={false}
            />
          </mesh>
  
        </mesh>
      </Trail>
  
      {/* Secondary trail — offset slightly, different colour */}
      <Trail
        width={0.3}
        length={14}
        color={new THREE.Color('#FFD8A0')}
        attenuation={(t) => t * t * t}
      >
        <mesh ref={trail2Ref}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial
            color="#FFD8A0"
            emissive="#FFD8A0"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </Trail>
  
      {/* Third trail — offset other direction */}
      <Trail
        width={0.25}
        length={7}
        color={new THREE.Color('#B0E8FF')}
        attenuation={(t) => t * t * t}
      >
        <mesh ref={trail3Ref}>
          <sphereGeometry args={[0.01, 6, 6]} />
          <meshStandardMaterial
            color="#B0E8FF"
            emissive="#B0E8FF"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </Trail>
  
      {/* Trailing sparkles */}
      {/* Sparkles group — position tracked in useFrame */}
      <group ref={sparkleGroupRef}>
        {Array.from({ length: 8 }, (_, i) => (
          <SparkleParticle key={i} index={i} />
        ))}
      </group>
  
    </group>
  )
}

export default Fairy