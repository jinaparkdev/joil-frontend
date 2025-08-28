'use client'

import { useState, useEffect } from 'react'
import { Vector3, Euler } from 'three'
import { useFurnitureStore } from '@/stores/furnitureStore'

export default function PropertiesPanel() {
  const items = useFurnitureStore((state) => state.items)
  const updateFurniture = useFurnitureStore((state) => state.updateFurniture)
  const removeFurniture = useFurnitureStore((state) => state.removeFurniture)
  const duplicateFurniture = useFurnitureStore((state) => state.duplicateFurniture)
  
  const selectedItem = items.find(item => item.isSelected)
  
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 })

  useEffect(() => {
    if (selectedItem) {
      setPosition({
        x: Number(selectedItem.transform.position.x.toFixed(2)),
        y: Number(selectedItem.transform.position.y.toFixed(2)),
        z: Number(selectedItem.transform.position.z.toFixed(2))
      })
      setRotation({
        x: Number((selectedItem.transform.rotation.x * 180 / Math.PI).toFixed(1)),
        y: Number((selectedItem.transform.rotation.y * 180 / Math.PI).toFixed(1)),
        z: Number((selectedItem.transform.rotation.z * 180 / Math.PI).toFixed(1))
      })
      setScale({
        x: Number(selectedItem.transform.scale.x.toFixed(2)),
        y: Number(selectedItem.transform.scale.y.toFixed(2)),
        z: Number(selectedItem.transform.scale.z.toFixed(2))
      })
    }
  }, [selectedItem])

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedItem) return
    
    const newPosition = { ...position, [axis]: value }
    setPosition(newPosition)
    
    updateFurniture(selectedItem.id, {
      transform: {
        ...selectedItem.transform,
        position: new Vector3(newPosition.x, newPosition.y, newPosition.z)
      }
    })
  }

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedItem) return
    
    const newRotation = { ...rotation, [axis]: value }
    setRotation(newRotation)
    
    updateFurniture(selectedItem.id, {
      transform: {
        ...selectedItem.transform,
        rotation: new Euler(
          newRotation.x * Math.PI / 180,
          newRotation.y * Math.PI / 180,
          newRotation.z * Math.PI / 180
        )
      }
    })
  }

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (!selectedItem) return
    
    const newScale = { ...scale, [axis]: value }
    setScale(newScale)
    
    updateFurniture(selectedItem.id, {
      transform: {
        ...selectedItem.transform,
        scale: new Vector3(newScale.x, newScale.y, newScale.z)
      }
    })
  }

  const handleUniformScale = (value: number) => {
    if (!selectedItem) return
    
    const newScale = { x: value, y: value, z: value }
    setScale(newScale)
    
    updateFurniture(selectedItem.id, {
      transform: {
        ...selectedItem.transform,
        scale: new Vector3(value, value, value)
      }
    })
  }

  const handleDelete = () => {
    if (selectedItem && window.confirm('이 가구를 삭제하시겠습니까?')) {
      removeFurniture(selectedItem.id)
    }
  }

  const handleDuplicate = () => {
    if (selectedItem) {
      duplicateFurniture(selectedItem.id)
    }
  }

  if (!selectedItem) {
    return (
      <div className="absolute bottom-4 right-4 z-10 w-80">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">속성 패널</h3>
          <p className="text-gray-500 text-center py-8">
            가구를 선택하여 속성을 편집하세요
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-4 right-4 z-10 w-80">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">속성 패널</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleDuplicate}
              className="p-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
              title="복제"
            >
              📋
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
              title="삭제"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">선택된 객체</h4>
            <p className="text-sm text-gray-600">{selectedItem.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">위치</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {axis.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={position[axis]}
                    onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-gray-900 font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">회전 (도)</h4>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {axis.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rotation[axis]}
                    onChange={(e) => handleRotationChange(axis, parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-gray-900 font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">크기</h4>
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">
                균등 스케일
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={scale.x}
                onChange={(e) => handleUniformScale(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">
                {scale.x}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {axis.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={scale[axis]}
                    onChange={(e) => handleScaleChange(axis, parseFloat(e.target.value) || 0.1)}
                    className="w-full px-2 py-1 text-sm bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-gray-900 font-medium"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
