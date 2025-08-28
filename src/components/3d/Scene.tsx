'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react'
import { Vector3 } from 'three'
import Room from './Room'
import Furniture from './Furniture'
import { useSceneStore } from '@/stores/sceneStore'
import { useFurnitureStore, setOrbitControlsRef } from '@/stores/furnitureStore'

function SceneContent() {
  const orbitControlsRef = useRef<any>(null)
  const room = useSceneStore((state) => state.room)
  const furnitureItems = useFurnitureStore((state) => state.items)
  const showGrid = useFurnitureStore((state) => state.editor.showGrid)
  const gridSize = useFurnitureStore((state) => state.editor.gridSize)
  const isDraggingAny = furnitureItems.some(item => item.isDragging)

  useEffect(() => {
    setOrbitControlsRef(orbitControlsRef)
  }, [])

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={!isDraggingAny}
        enableZoom={!isDraggingAny}
        enableRotate={!isDraggingAny}
        minDistance={2}
        maxDistance={50}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        target={new Vector3(0, 0, 0)}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {showGrid && (
        <Grid
          position={[0, 0, 0]}
          args={[20, 20]}
          cellSize={gridSize}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#333333"
          fadeDistance={25}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
      )}
      
      <Room room={room} />
      
      {furnitureItems.map((item) => (
        <Furniture key={item.id} item={item} />
      ))}
      
      <Environment preset="apartment" />
    </>
  )
}


interface SceneProps {
  className?: string
}

export default function Scene({ className }: SceneProps) {
  return (
    <div className={className}>
      <Canvas
        shadows
        camera={{
          position: [8, 6, 8],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}