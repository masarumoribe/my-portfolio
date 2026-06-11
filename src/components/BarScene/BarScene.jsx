import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Fog } from 'three'
import { COLORS, SCENE } from '../config'
import Bar from './Bar'

function BarScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
        {/* Temporary orbit controls — lets you rotate/zoom with mouse.
            We'll remove this once the scene looks right. */}
        <OrbitControls />

        {/* Stronger ambient so we can see the geometry clearly */}
        <ambientLight intensity={3} color="#ffffff" />

        {/* A bright point light in the center of the room */}
        <pointLight
          position={[0, 3, 2]}
          intensity={6}
          color="#ffffff"
        />

        {/* Extra fill light from the front */}
        <pointLight
        position={[0, 0, 5]}
        intensity={3}
        color="#ffffff"
        />

        <Physics gravity={[0, -6, 0]}>
          <Bar />
        </Physics>

      </Canvas>
    </div>
  )
}

export default BarScene