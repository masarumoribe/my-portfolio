import { useGLTF } from '@react-three/drei'

function ReactBottle() {
  const { nodes, materials } = useGLTF('/models/react_tequila.glb')

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

useGLTF.preload('/models/react_tequila.glb')

export default ReactBottle