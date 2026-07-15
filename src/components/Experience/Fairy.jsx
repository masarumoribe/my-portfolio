import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { WAYPOINTS, MOMENTS, toProgress } from '../config'

// Curve is defined once outside the component —
// creating it inside would rebuild it every render
const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

function Fairy({ progressRef }) {
  const meshRef  = useRef()
  const glowRef  = useRef()
  const groupRef = useRef()
  const exploded = useRef(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const p = progressRef.current
    const { transition, about } = MOMENTS
  
    const transStart = toProgress(transition.start)
    const transEnd   = toProgress(transition.end)
    const aboutStart = toProgress(about.start)
  
    // Hide during explosion/projects, reappear for about onwards
    if (p >= transEnd && p < aboutStart) {
      if (groupRef.current) groupRef.current.visible = false
      return
    } else {
      if (groupRef.current) groupRef.current.visible = true
    }

  
    // Get base position on curve
    const point = curve.getPointAt(THREE.MathUtils.clamp(p, 0, 1))
  
    // Gentle organic wobble — always present
    point.y += Math.sin(t * 1.8) * 0.06
    point.x += Math.sin(t * 1.2) * 0.03
  
    // Shaking — increases as we approach the explosion point
    if (p >= transStart && p < transEnd) {
      const shakeFactor = (p - transStart) / (transEnd - transStart)
      const shakeAmt    = shakeFactor * 0.3
      point.x += (Math.random() - 0.5) * shakeAmt
      point.y += (Math.random() - 0.5) * shakeAmt
      point.z += (Math.random() - 0.5) * shakeAmt * 0.5
    }
  
    meshRef.current.position.copy(point)
  
    // Pulse speed — now correctly using toProgress values
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
          {/* Core orb */}
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFE8C0"
            emissiveIntensity={3}
            toneMapped={false}
          />

          {/* Point light attached to the fairy — illuminates nearby objects */}
          <pointLight
            color="#FFF5E8"
            intensity={15}
            distance={8}
            decay={2}
          />


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
    </group>
  )
}

export default Fairy