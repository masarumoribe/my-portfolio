import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function NodeBottle() {
  const { nodes, materials } = useGLTF('/models/node_bourbon.glb')

  return (
    <group dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
      />
    </group>
  )
}

useGLTF.preload('/models/node_bourbon.glb')

export default NodeBottle