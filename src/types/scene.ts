import { Vector3, Euler } from 'three'

export interface Transform {
  position: Vector3
  rotation: Euler
  scale: Vector3
}

export interface FurnitureItem {
  id: string
  name: string
  modelPath: string
  category: string
  transform: Transform
  thumbnail?: string
  isSelected?: boolean
  isDragging?: boolean
}

export interface Room {
  id: string
  name: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  walls: Wall[]
  floor: Floor
  ceiling: Ceiling
}

export interface Wall {
  id: string
  position: Vector3
  rotation: Euler
  width: number
  height: number
  thickness: number
  material: {
    color: string
    texture?: string
  }
}

export interface Floor {
  width: number
  depth: number
  material: {
    color: string
    texture?: string
  }
}

export interface Ceiling {
  width: number
  depth: number
  height: number
  material: {
    color: string
    texture?: string
  }
}

export interface Camera {
  position: Vector3
  target: Vector3
}

export interface SceneState {
  room: Room
  furnitureItems: FurnitureItem[]
  selectedItemId: string | null
  camera: Camera
  isLoading: boolean
  error: string | null
}

export interface FurnitureCategory {
  id: string
  name: string
  items: FurnitureTemplate[]
}

export interface FurnitureTemplate {
  id: string
  name: string
  modelPath: string
  thumbnail: string
  defaultScale: Vector3
  category: string
}

export type EditorMode = 'select' | 'move' | 'rotate' | 'scale' | 'add'

export interface EditorState {
  mode: EditorMode
  selectedTool: string | null
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
}