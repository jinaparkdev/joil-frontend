'use client'

import { useEffect } from 'react'
import Scene from '@/components/3d/Scene'
import Toolbar from '@/components/ui/Toolbar'
import FurniturePanel from '@/components/ui/FurniturePanel'
import PropertiesPanel from '@/components/ui/PropertiesPanel'
import { useFurnitureStore } from '@/stores/furnitureStore'

export default function EditorPage() {
  const loadCategories = useFurnitureStore((state) => state.loadCategories)

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <Scene className="w-full h-full" />
      
      <Toolbar />
      <FurniturePanel />
      <PropertiesPanel />
      
      <div className="absolute bottom-4 left-4 z-10">

      </div>
    </div>
  )
}
