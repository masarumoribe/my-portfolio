import { useGLTF } from '@react-three/drei'

function CocktailSarau() {
  const { nodes, materials } = useGLTF('/models/thesarau_mojito.glb')
  return (
    <group dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} />
    </group>
  )
}
useGLTF.preload('/models/thesarau_mojito.glb')
export default CocktailSarau