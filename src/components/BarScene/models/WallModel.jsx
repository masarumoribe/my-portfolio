import { useGLTF } from '@react-three/drei'

// WallModel is purely visual — no RigidBody needed.
// The side wall physics colliders in Bar.jsx handle blocking.
// The back wall is never reached by physics objects so needs no collider.

function WallModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const { nodes, materials } = useGLTF('/models/back_wall.glb')

  console.log(materials)

  return (
    <group position={position} scale={scale} rotation={rotation} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        >
        <meshStandardMaterial
            map={materials[""].map}
            normalMap={materials[""].normalMap}
            roughnessMap={materials[""].roughnessMap}
            metalnessMap={materials[""].metalnessMap}
            roughness={materials[""].roughness}
            metalness={0.5}
            emissive="#654321"
            emissiveIntensity={0.2}
        />
        </mesh>
    </group>
  )
}

useGLTF.preload('/models/back_wall.glb')

export default WallModel