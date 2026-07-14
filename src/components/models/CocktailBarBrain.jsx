import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function CocktailBarBrain() {
  const { nodes, materials } = useGLTF('/models/barbrain_manhattan.glb')
  const groupRef = useRef()

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.emissive         = new THREE.Color('#888888')
        child.material.emissiveIntensity = 0.3
        child.material.metalness         = 0.1
        child.material.needsUpdate       = true
      }
    })
  }, [])

  return (
    <group ref={groupRef} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
      />
    </group>
  )
}

useGLTF.preload('/models/cocktail_barbrain.glb')

export default CocktailBarBrain