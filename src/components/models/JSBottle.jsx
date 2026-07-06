import { useGLTF } from '@react-three/drei'

  function JSBottle() {
  const { nodes, materials } = useGLTF('/models/js_gin.glb')

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

useGLTF.preload('/models/js_gin.glb')

export default JSBottle