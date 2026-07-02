import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Fog } from 'three'
import * as THREE from 'three'
import { COLORS, WAYPOINTS } from '../config'
import Fairy from './Fairy'
import CameraRig from './CameraRig'
import Journey from './Journey'

function Experience({ progressRef, targetRef }) {
  const lastScrollTime = useRef(0)

  const handleScroll = (e) => {
    targetRef.current = THREE.MathUtils.clamp(
      targetRef.current + e.deltaY * 0.0002,
      0,
      1
    )
  }

  return (
    <div
      style={{ width: '100vw', height: '100vh', background: COLORS.background }}
      onWheel={handleScroll}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 55 }}
        onCreated={({ scene }) => {
          scene.fog = new Fog(COLORS.fog, 8, 22)
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} color={COLORS.ambient} />
        <pointLight position={[0, 5, 5]} intensity={1} color={COLORS.moonLight} />

        {/* Ambient magic dust */}
        <Sparkles
          count={80}
          scale={12}
          size={0.6}
          speed={0.15}
          color="#C8A8FF"
          opacity={0.4}
        />

        {/* Core components — all share progressRef */}
        <Fairy progressRef={progressRef} targetRef={targetRef} />
        <CameraRig progressRef={progressRef} />
        <Journey progressRef={progressRef} targetRef={targetRef} />

      </Canvas>
    </div>
  )
}

export default Experience