import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TOTAL_SCROLL } from '../config'

function Journey({ progressRef, scrollYRef, targetScrollY }) {
  useFrame(() => {
    // Lerp raw scroll position smoothly
    scrollYRef.current = THREE.MathUtils.lerp(
      scrollYRef.current,
      targetScrollY.current,
      0.04  // lower = smoother/slower feeling
    )

    // Convert to 0-1
    progressRef.current = scrollYRef.current / TOTAL_SCROLL
  })

  return null
}

export default Journey