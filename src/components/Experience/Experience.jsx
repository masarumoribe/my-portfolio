import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { Fog } from 'three'
import * as THREE from 'three'
import { COLORS, WAYPOINTS, TOTAL_SCROLL } from '../config'
import Fairy from './Fairy'
import CameraRig from './CameraRig'
import Journey from './Journey'
import Skills from './moments/Skills'
import Explosion from './Explosion'
import Projects from './moments/Projects'

function Experience({ progressRef, targetRef, scrollYRef, targetScrollY, onProjectHover, onProjectUnhover }) {
  const divRef         = useRef()

  // Attached to window (not divRef) so it keeps firing even when the
  // pointer is over a fixed-position overlay (e.g. AboutText, ProjectHoverCard)
  // that sits outside this div's DOM subtree and briefly takes pointer-events.
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()

      targetScrollY.current = THREE.MathUtils.clamp(
        targetScrollY.current + e.deltaY,
        0,
        TOTAL_SCROLL
      )
    }

    // Use a non-passive listener so preventDefault works
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div
      ref={divRef}
      style={{ width: '100vw', height: '100vh', background: COLORS.background }}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 55 }}
        onCreated={({ scene }) => {
          scene.fog = new Fog(COLORS.fog, 8, 22)
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={1.8} color="#ffffff" />
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
        <Journey 
          progressRef={progressRef} 
          targetRef={targetRef} 
          scrollYRef={scrollYRef}
          targetScrollY={targetScrollY}
        />
        <Skills progressRef={progressRef} />
        <Explosion progressRef={progressRef} />

        <Projects 
          progressRef={progressRef}
          onProjectHover={onProjectHover}
          onProjectUnhover={onProjectUnhover}
        />

      </Canvas>
    </div>
  )
}

export default Experience