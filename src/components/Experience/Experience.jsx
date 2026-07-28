import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles, Preload } from '@react-three/drei'
import { Fog } from 'three'
import * as THREE from 'three'
import { COLORS, WAYPOINTS, TOTAL_SCROLL } from '../config'
import Fairy from './Fairy'
import CameraRig from './CameraRig'
import Journey from './Journey'
import Skills from './moments/Skills'
import Explosion from './Explosion'
import Projects from './moments/Projects'
import Contact from './moments/Contact'

function Experience({ progressRef, targetRef, scrollYRef, targetScrollY, onProjectHover, onProjectUnhover }) {
  const divRef = useRef()
  const fairyMeshRef = useRef()

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

    // Touch handling for mobile
    let touchStartY = 0

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
  
    const handleTouchMove = (e) => {
      e.preventDefault()
      const touchY   = e.touches[0].clientY
      const deltaY   = touchStartY - touchY  // inverted — swipe up = scroll forward
      touchStartY    = touchY
  
      targetScrollY.current = THREE.MathUtils.clamp(
        targetScrollY.current + deltaY * 8,  // multiplier — tune for feel
        0,
        TOTAL_SCROLL
      )
    }  

    // Use a non-passive listener so preventDefault works
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div
      ref={divRef}
      style={{ width: '100vw', height: '100vh', background: COLORS.background }}
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 55 }}
        onCreated={({ scene }) => {
          scene.fog = new Fog(COLORS.fog, 20, 60)
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
        <Fairy progressRef={progressRef} meshRef={fairyMeshRef}/>
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

        <Contact progressRef={progressRef} fairyRef={fairyMeshRef} />

        <Preload all />
      </Canvas>
    </div>
  )
}

export default Experience