import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { WAYPOINTS, MOMENTS, toProgress, LANTERN_WORLD_POS } from '../config'

// Curve is defined once outside the component —
// creating it inside would rebuild it every render
const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

function Fairy({ progressRef, meshRef: externalMeshRef }) {
  const meshRef  = externalMeshRef || useRef()
  const glowRef  = useRef()
  const groupRef = useRef()

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
      console.log('CONTACT BLOCK RUNNING — setting position to lantern')
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
  
    // Pulse
    const pulseSpeed = (p >= transStart && p < transEnd)
      ? 3 + ((p - transStart) / (transEnd - transStart)) * 8
      : 3
    const pulse = 1 + Math.sin(t * pulseSpeed) * 0.15
    if (glowRef.current) glowRef.current.scale.setScalar(pulse)
  })

  return (
    <group ref={groupRef}>
      <Trail
        width={1.8}
        length={14}
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
    </group>
  )
}

export default Fairy