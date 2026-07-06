import { useGLTF } from '@react-three/drei'

function PythonBottle() {
  const { nodes, materials } = useGLTF('/models/python_whisky.glb')

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

useGLTF.preload('/models/python_whisky.glb')

export default PythonBottle