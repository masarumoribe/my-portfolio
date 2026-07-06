import { useGLTF } from '@react-three/drei'

  function HTMLBottle() {
  const { nodes, materials } = useGLTF('/models/html_vodka.glb')

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

useGLTF.preload('/models/html_vodka.glb')

export default HTMLBottle