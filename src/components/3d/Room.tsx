'use client'

import { useMemo } from 'react'
import { Room as RoomType } from '@/types/scene'

interface RoomProps {
  room: RoomType
}

function Wall({ wall }: { wall: RoomType['walls'][0] }) {
  return (
    <mesh
      position={wall.position}
      rotation={wall.rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[wall.width, wall.height, wall.thickness]} />
      <meshLambertMaterial color={wall.material.color} />
    </mesh>
  )
}

function Floor({ floor, dimensions }: { floor: RoomType['floor'], dimensions: RoomType['dimensions'] }) {
  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[dimensions.width, dimensions.depth]} />
      <meshLambertMaterial color={floor.material.color} />
    </mesh>
  )
}

function Ceiling({ ceiling, dimensions }: { ceiling: RoomType['ceiling'], dimensions: RoomType['dimensions'] }) {
  return (
    <mesh
      position={[0, dimensions.height, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[dimensions.width, dimensions.depth]} />
      <meshLambertMaterial color={ceiling.material.color} />
    </mesh>
  )
}

export default function Room({ room }: RoomProps) {
  const memoizedWalls = useMemo(() => {
    return room.walls.map((wall) => (
      <Wall key={wall.id} wall={wall} />
    ))
  }, [room.walls])

  return (
    <group>
      <Floor floor={room.floor} dimensions={room.dimensions} />
      <Ceiling ceiling={room.ceiling} dimensions={room.dimensions} />
      {memoizedWalls}
    </group>
  )
}