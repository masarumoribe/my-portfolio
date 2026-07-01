// import BarScene from './components/BarScene/BarScene'

// function App() {
//   return (
//       <BarScene />
//   )
// }

// export default App

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Trail, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// Waypoints much closer together and staying in front of the camera.
// The curve now arcs gently left→right→forward in a visible range.
const waypoints = [
  new THREE.Vector3(-3,  0,    2),   // Hero — left side
  new THREE.Vector3(-1,  0.8,  1),   // curve upward
  new THREE.Vector3( 0,  0.2,  0),   // center
  new THREE.Vector3( 1,  1.0, -1),   // Skills — right and back
  new THREE.Vector3( 2,  0.2, -2),   // Projects
  new THREE.Vector3( 0,  1.5, -3),   // About — center back
  new THREE.Vector3(-1,  0.5, -4),   // Contact — left back
]

const curve = new THREE.CatmullRomCurve3(waypoints)

// Pre-sample 200 points along the curve for the visible path line
const curvePoints = curve.getPoints(200)
const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints)

function Fairy({ progressRef }) {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const point = curve.getPointAt(progressRef.current)

    // Gentle sine bob — small amplitude so it feels alive not seasick
    point.y += Math.sin(t * 1.8) * 0.06
    point.x += Math.sin(t * 1.2) * 0.03

    meshRef.current.position.copy(point)

    // Pulse the glow sphere scale
    const pulse = 1 + Math.sin(t * 3) * 0.15
    if (glowRef.current) glowRef.current.scale.setScalar(pulse)
  })

  return (
    <Trail
      width={1.5}
      length={12}
      color={new THREE.Color('#C8A8FF')}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        {/* Core bright orb */}
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFE8C0"
          emissiveIntensity={3}
          toneMapped={false}
        />

        {/* Outer glow — larger transparent sphere around the core */}
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

function Scene({ progressRef }) {
  return (
    <>
      <ambientLight intensity={0.4} color="#2A1F4A" />
      <pointLight position={[0, 3, 3]} intensity={1} color="#C8C0FF" />

      {/* Visible curve path — faint dotted line showing the route */}
      <line geometry={curveGeometry}>
        <lineBasicMaterial
          color="#4A3880"
          transparent
          opacity={0.3}
        />
      </line>

      {/* Ambient sparkles floating in the scene */}
      <Sparkles
        count={60}
        scale={8}
        size={0.8}
        speed={0.2}
        color="#C8A8FF"
        opacity={0.5}
      />

      <Fairy progressRef={progressRef} />

      <OrbitControls
        enableZoom={false}
        autoRotate={false}
      />
    </>
  )
}

export default function App() {
  const progressRef = useRef(0)
  const targetRef = useRef(0)

  const handleScroll = (e) => {
    // Each wheel tick nudges the target by a small amount.
    // 0.003 = how much one scroll tick moves along the curve.
    // Lower = more scroll needed to traverse the full path (slower, more control)
    // Higher = less scroll needed (faster)
    targetRef.current = THREE.MathUtils.clamp(
      targetRef.current + e.deltaY * 0.003,
      0,
      1
    )
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#0D0A1A',
        overflow: 'hidden'
      }}
      onWheel={handleScroll}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene progressRef={progressRef} />
        <ProgressUpdater
          progressRef={progressRef}
          targetRef={targetRef}
        />
      </Canvas>
    </div>
  )
}
// Separate component so we can use useFrame inside Canvas
function ProgressUpdater({ progressRef, targetRef }) {
  useFrame(() => {
    // Lerp chases the target in real time — fast enough to feel responsive,
    // slow enough to feel floaty and magical rather than rigid.
    // 0.06 = fairly responsive. Try 0.04 for dreamier, 0.1 for snappier.
    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      targetRef.current,
      0.04
    )
  })
  return null
}