'use client'

import { useState } from 'react'
import { Vector3 } from 'three'
import Image from 'next/image'
import { useFurnitureStore } from '@/stores/furnitureStore'
import { FurnitureTemplate } from '@/types/scene'

export default function FurniturePanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>('seating')
  const categories = useFurnitureStore((state) => state.categories)
  const addFurniture = useFurnitureStore((state) => state.addFurniture)

  const handleAddFurniture = (template: FurnitureTemplate) => {
    const randomX = (Math.random() - 0.5) * 6
    const randomZ = (Math.random() - 0.5) * 6
    addFurniture(template, new Vector3(randomX, 0, randomZ))
  }

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)

  return (
    <div className="absolute top-4 right-4 z-10 w-80">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">가구 라이브러리</h2>
        
        <div className="mb-4">
          <div className="flex space-x-1 mb-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {selectedCategoryData?.items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleAddFurniture(item)}
            >
              <div className="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center relative">
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                    onError={() => {
                      console.log('Failed to load thumbnail for:', item.name)
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    📦
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1">클릭하여 추가</p>
            </div>
          ))}
        </div>

        {selectedCategoryData?.items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            이 카테고리에는 아직 가구가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}