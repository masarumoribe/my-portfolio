import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

function CSSBottle({ position, scale = 1, yOffset = 0 }) {
  const { nodes, materials } = useGLTF('/models/css_rum.glb')

  const adjustedPosition = [position[0], position[1] + yOffset, position[2] - 0.2]

  return (
    <group scale={scale}>
      <RigidBody
        type="dynamic"
        position={adjustedPosition}
        restitution={0.2}
        friction={0.8}
        colliders="hull"     
        linearDamping={0.8}
        angularDamping={0.8}
      >
        <group scale={0.9} dispose={null}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.mesh_0.geometry}
            material={nodes.mesh_0.material}
          />
        </group>
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/models/css_rum.glb')

export default CSSBottle