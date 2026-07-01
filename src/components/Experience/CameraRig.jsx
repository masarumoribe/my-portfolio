import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { WAYPOINTS } from '../config'

const curve = new THREE.CatmullRomCurve3(WAYPOINTS)

function CameraRig({ progressRef }) {
  const { camera } = useThree()

  // These refs hold the smoothed camera position and look target.
  // By lerping them independently we avoid sudden flips.
  const smoothPos  = useRef(new THREE.Vector3(0, 1.5, 10))
  const smoothLook = useRef(new THREE.Vector3(0, 0.5, 8))

  useFrame(() => {
    const progress = progressRef.current

    // Fairy position on the curve
    const fairyPos = curve.getPointAt(
      THREE.MathUtils.clamp(progress, 0, 1)
    )

    // Look slightly ahead — clamp so it never goes past the end
    const aheadProgress = THREE.MathUtils.clamp(progress + 0.05, 0, 1)
    const aheadPos = curve.getPointAt(aheadProgress)

    // Desired camera position — above and behind the fairy
    const desiredPos = new THREE.Vector3(
      fairyPos.x * 0.5,   // partial X follow — less dizzying than full follow
      fairyPos.y + 1.4,   // above the fairy
      fairyPos.z + 5,     // behind the fairy
    )

    // Lerp smoothPos toward desired — 0.03 = cinematic lag
    // This is what prevents the spin — position never jumps suddenly
    smoothPos.current.lerp(desiredPos, 0.03)

    // Lerp smoothLook toward ahead point — same principle
    smoothLook.current.lerp(aheadPos, 0.03)

    // Apply to camera
    camera.position.copy(smoothPos.current)
    camera.lookAt(smoothLook.current)
  })

  return null
}

export default CameraRig