import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'

function NodeBottle({ position, scale = 1, yOffset = 0 }) {
  const { nodes, materials } = useGLTF('/models/node_bourbon.glb')

  const adjustedPosition = [position[0], 2, position[2]]

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
        <group scale={scale} dispose={null}>
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

useGLTF.preload('/models/node_bourbon.glb')

export default NodeBottle