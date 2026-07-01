import { useGLTF } from '@react-three/drei'

// CounterModel is a purely visual component — no RigidBody.
// The physics collider for the counter still lives in Bar.jsx as an
// invisible box. This model just sits on top and looks beautiful.
// Props:
//   position — [x, y, z] to align with the invisible collider
//   scale    — adjust if the model comes in too big or small
//   rotation — adjust if the model faces the wrong direction

function CounterModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const { nodes, materials } = useGLTF('/models/bar_counter.glb')

  return (
    <group position={position} scale={scale} rotation={rotation} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
      />
    </group>
  )
}

useGLTF.preload('/models/bar_counter.glb')

export default CounterModel