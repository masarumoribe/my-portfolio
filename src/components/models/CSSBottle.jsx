import { useGLTF } from '@react-three/drei'

function CSSBottle() {
  const { nodes, materials } = useGLTF('/models/css_rum.glb')

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

useGLTF.preload('/models/css_rum.glb')

export default CSSBottle