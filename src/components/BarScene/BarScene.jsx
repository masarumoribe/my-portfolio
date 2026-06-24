import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Fog } from 'three'
import { useState, useEffect } from 'react'
import { COLORS, SCENE } from '../config'
import Bar from './Bar'

function BarScene() {
  // Ready controls visibility of the whole scene.
  // We wait a short moment for physics to settle before showing anything.
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>

      {/* Loading overlay — sits on top while physics warms up.
          Fades out once ready. */}
      <div style={{
        position:   'fixed',
        inset:      0,
        background: COLORS.background,
        zIndex:     10,
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Fade out once ready, stay visible while warming up
        opacity:    ready ? 0 : 1,
        // Transition the fade — 400ms feels natural
        transition: 'opacity 0.4s ease',
        // Once fully transparent, remove from pointer events
        pointerEvents: ready ? 'none' : 'all',
      }}>
        {/* Optional: small loading indicator */}
        <div style={{
          color:      '#C8A8FF',
          fontSize:   '14px',
          letterSpacing: '0.15em',
          opacity:    0.6,
          fontFamily: 'sans-serif',
        }}>
          ✦
        </div>
      </div>

      <Canvas
        shadows
        camera={{
          position: [0, SCENE.cameraY, SCENE.cameraZ],
          fov: 55,
          near: 0.1,
          far: 50,
        }}
        onCreated={({ scene }) => {
          scene.fog = new Fog(COLORS.fog, 12, 28)
        }}
      >
        <OrbitControls />
        <ambientLight intensity={3} color="#ffffff" />
        <pointLight position={[0, 3, 2]} intensity={6} color="#ffffff" />
        <pointLight position={[0, 0, 5]} intensity={3} color="#ffffff" />

        <Physics gravity={[0, -6, 0]}>
          <Bar />
        </Physics>

      </Canvas>
    </div>
  )
}

export default BarScene