import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Journey owns the scroll → progress update logic.
// It lerps progressRef toward targetRef every frame.
// All moment components read progressRef directly.

function Journey({ progressRef, targetRef }) {
  useFrame(() => {
    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      targetRef.current,
      0.06
    )
  })
  return null
}

export default Journey