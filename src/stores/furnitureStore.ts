import { create } from 'zustand'
import { Vector3, Euler } from 'three'
import { FurnitureItem, EditorState, EditorMode, FurnitureCategory, FurnitureTemplate } from '@/types/scene'

interface FurnitureStore {
  items: FurnitureItem[]
  categories: FurnitureCategory[]
  editor: EditorState
  
  addFurniture: (template: FurnitureTemplate, position?: Vector3) => void
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void
  removeFurniture: (id: string) => void
  selectFurniture: (id: string | null) => void
  duplicateFurniture: (id: string) => void
  setDragging: (id: string, isDragging: boolean) => void
  
  setEditorMode: (mode: EditorMode) => void
  setSelectedTool: (tool: string | null) => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  setGridSize: (size: number) => void
  resetView: () => void
  
  loadCategories: () => void
  reset: () => void
}

const defaultCategories: FurnitureCategory[] = [
  {
    id: 'desk',
    name: '책상',
    items: [
      {
        id: 'desk-1',
        name: '책상',
        modelPath: '/models/furniture/FEV0000005.glb',
        thumbnail: '/thumbnails/chair-office.jpg',
        defaultScale: new Vector3(1, 1, 1),
        category: 'desk'
      },
    ]
  }
]

const initialEditor: EditorState = {
  mode: 'select',
  selectedTool: null,
  showGrid: true,
  snapToGrid: true,
  gridSize: 0.5
}

let orbitControlsRef: any = null

export const setOrbitControlsRef = (ref: any) => {
  orbitControlsRef = ref
}

export const useFurnitureStore = create<FurnitureStore>((set, get) => ({
  items: [],
  categories: defaultCategories,
  editor: initialEditor,
  
  addFurniture: (template, position = new Vector3(0, 0, 0)) => {
    const id = `${template.id}-${Date.now()}`
    const newItem: FurnitureItem = {
      id,
      name: template.name,
      modelPath: template.modelPath,
      category: template.category,
      transform: {
        position: position.clone(),
        rotation: new Euler(0, 0, 0),
        scale: template.defaultScale.clone()
      },
      thumbnail: template.thumbnail,
      isSelected: false,
      isDragging: false
    }
    
    set((state) => ({
      items: [...state.items, newItem]
    }))
  },
  
  updateFurniture: (id, updates) => {
    set((state) => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    }))
  },
  
  removeFurniture: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }))
  },
  
  selectFurniture: (id) => {
    set((state) => ({
      items: state.items.map(item => ({
        ...item,
        isSelected: item.id === id
      }))
    }))
  },
  
  duplicateFurniture: (id) => {
    const item = get().items.find(item => item.id === id)
    if (item) {
      const newPosition = item.transform.position.clone().add(new Vector3(1, 0, 1))
      const template: FurnitureTemplate = {
        id: item.id.split('-')[0],
        name: item.name,
        modelPath: item.modelPath,
        thumbnail: item.thumbnail || '',
        defaultScale: item.transform.scale,
        category: item.category
      }
      get().addFurniture(template, newPosition)
    }
  },
  
  setEditorMode: (mode) => {
    set((state) => ({
      editor: { ...state.editor, mode }
    }))
  },
  
  setSelectedTool: (tool) => {
    set((state) => ({
      editor: { ...state.editor, selectedTool: tool }
    }))
  },
  
  toggleGrid: () => {
    set((state) => ({
      editor: { ...state.editor, showGrid: !state.editor.showGrid }
    }))
  },
  
  toggleSnapToGrid: () => {
    set((state) => ({
      editor: { ...state.editor, snapToGrid: !state.editor.snapToGrid }
    }))
  },
  
  setGridSize: (size) => {
    set((state) => ({
      editor: { ...state.editor, gridSize: size }
    }))
  },

  setDragging: (id, isDragging) => {
    set((state) => ({
      items: state.items.map(item => 
        item.id === id ? { ...item, isDragging } : item
      )
    }))
  },
  
  loadCategories: () => {
    set(() => ({ categories: defaultCategories }))
  },
  
  resetView: () => {
    if (orbitControlsRef?.current) {
      orbitControlsRef.current.reset()
    }
  },

  reset: () => {
    set(() => ({
      items: [],
      categories: defaultCategories,
      editor: initialEditor
    }))
  }
}))
