'use client'

import {useEffect, useRef, useState} from 'react'
import {ThreeEvent, useThree} from '@react-three/fiber'
import {Group, Plane, Vector2, Vector3} from 'three'
import {FurnitureItem} from '@/types/scene'
import {loadGLTFModel} from '@/utils/loaders'
import {useFurnitureStore} from '@/stores/furnitureStore'

interface FurnitureProps {
    item: FurnitureItem
}

export default function Furniture({item}: FurnitureProps) {
    const groupRef = useRef<Group>(null)
    const [model, setModel] = useState<Group | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragPlane] = useState(() => new Plane(new Vector3(0, 1, 0), 0))

    const {camera, gl, raycaster} = useThree()
    const updateFurniture = useFurnitureStore((state) => state.updateFurniture)
    const selectFurniture = useFurnitureStore((state) => state.selectFurniture)
    const setDragging = useFurnitureStore((state) => state.setDragging)

    useEffect(() => {
        let isMounted = true

        const loadModel = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const loadedModel = await loadGLTFModel(item.modelPath)

                if (isMounted) {
                    setModel(loadedModel)
                    setIsLoading(false)
                }
            } catch {
                if (isMounted) {
                    console.warn(`Could not load model ${item.modelPath}, using fallback`)
                    setError(`Failed to load model: ${item.modelPath}`)
                    setIsLoading(false)
                }
            }
        }

        loadModel()

        return () => {
            isMounted = false
        }
    }, [item.modelPath])

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation()
        selectFurniture(item.id)
        setIsDragging(true)
        setDragging(item.id, true)
        gl.domElement.style.cursor = 'grabbing'
    }

    const handlePointerUp = () => {
        setIsDragging(false)
        setDragging(item.id, false)
        gl.domElement.style.cursor = 'grab'
    }

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        if (!isDragging || !groupRef.current) return

        event.stopPropagation()

        const intersect = new Vector3()
        raycaster.ray.intersectPlane(dragPlane, intersect)

        if (intersect) {
            groupRef.current.position.x = intersect.x
            groupRef.current.position.z = intersect.z

            updateFurniture(item.id, {
                transform: {
                    position: groupRef.current.position.clone(),
                    rotation: groupRef.current.rotation.clone(),
                    scale: groupRef.current.scale.clone()
                }
            })
        }
    }

    useEffect(() => {
        const handleGlobalPointerUp = () => {
            if (isDragging) {
                setIsDragging(false)
                setDragging(item.id, false)
                gl.domElement.style.cursor = 'grab'
            }
        }

        const handleGlobalPointerMove = (event: PointerEvent) => {
            if (!isDragging || !groupRef.current) return

            const rect = gl.domElement.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

            raycaster.setFromCamera(new Vector2(x, y), camera)

            const intersect = new Vector3()
            raycaster.ray.intersectPlane(dragPlane, intersect)

            if (intersect) {
                groupRef.current.position.x = intersect.x
                groupRef.current.position.z = intersect.z

                updateFurniture(item.id, {
                    transform: {
                        position: groupRef.current.position.clone(),
                        rotation: groupRef.current.rotation.clone(),
                        scale: groupRef.current.scale.clone()
                    }
                })
            }
        }

        if (isDragging) {
            document.addEventListener('pointerup', handleGlobalPointerUp)
            document.addEventListener('pointermove', handleGlobalPointerMove)
        }

        return () => {
            document.removeEventListener('pointerup', handleGlobalPointerUp)
            document.removeEventListener('pointermove', handleGlobalPointerMove)
        }
    }, [isDragging, camera, raycaster, gl, item.id, updateFurniture, setDragging, dragPlane])

    const FallbackBox = () => (
        <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]}/>
            <meshLambertMaterial
                color={item.isSelected ? "#ff6b6b" : "#4ecdc4"}
                transparent
                opacity={0.7}
            />
        </mesh>
    )

    const LoadingBox = () => (
        <mesh>
            <boxGeometry args={[1, 1, 1]}/>
            <meshLambertMaterial color="#cccccc" transparent opacity={0.5}/>
        </mesh>
    )

    return (
        <group
            ref={groupRef}
            position={item.transform.position}
            rotation={item.transform.rotation}
            scale={item.transform.scale}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        >
            {isLoading && <LoadingBox/>}
            {error && <FallbackBox/>}
            {model && !isLoading && !error && (
                <primitive object={model}/>
            )}

            {item.isSelected && (
                <mesh>
                    <boxGeometry args={[
                        (model?.userData?.boundingBox?.x || 1) + 0.1,
                        (model?.userData?.boundingBox?.y || 1) + 0.1,
                        (model?.userData?.boundingBox?.z || 1) + 0.1
                    ]}/>
                    <meshBasicMaterial
                        color="#ffff00"
                        transparent
                        opacity={0.2}
                        wireframe
                    />
                </mesh>
            )}
        </group>
    )
}
