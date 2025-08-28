'use client'

import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'
import { useSceneStore } from '@/stores/sceneStore'

interface CameraProps {
  enableAutoUpdate?: boolean
}

export default function Camera({ enableAutoUpdate = true }: CameraProps) {
  const cameraRef = useRef<PerspectiveCamera>(null)
  const { set } = useThree()
  const { camera: cameraState, updateCamera } = useSceneStore()

  useEffect(() => {
    if (cameraRef.current) {
      set({ camera: cameraRef.current })
    }
  }, [set])

  useFrame(() => {
    if (cameraRef.current && enableAutoUpdate) {
      const currentPosition = cameraRef.current.position
      const currentTarget = new Vector3()
      
      cameraRef.current.getWorldDirection(currentTarget)
      currentTarget.multiplyScalar(-1)
      currentTarget.add(currentPosition)

      if (!currentPosition.equals(cameraState.position) || 
          !currentTarget.equals(cameraState.target)) {
        updateCamera({
          position: currentPosition.clone(),
          target: currentTarget.clone()
        })
      }
    }
  })

  return (
    <perspectiveCamera
      ref={cameraRef}
      position={cameraState.position}
      fov={60}
      near={0.1}
      far={1000}
    />
  )
}