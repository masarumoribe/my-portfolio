import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { WAYPOINTS } from '../config'

// Curve is defined once outside the component —
// creating it inside would rebuild it every render
const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

function Fairy({ progressRef }) {
  const meshRef  = useRef()
  const glowRef  = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Get position along curve based on scroll progress
    const point = curve.getPointAt(progressRef.current)

    // Gentle organic wobble — small enough to feel alive, not distracting
    point.y += Math.sin(t * 1.8) * 0.06
    point.x += Math.sin(t * 1.2) * 0.03

    meshRef.current.position.copy(point)

    // Pulse the outer glow
    const pulse = 1 + Math.sin(t * 3) * 0.15
    if (glowRef.current) glowRef.current.scale.setScalar(pulse)
  })

  return (
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
  )
}

export default Fairy