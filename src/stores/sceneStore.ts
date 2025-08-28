import { create } from 'zustand'
import { Vector3, Euler } from 'three'
import { SceneState, Room, Camera } from '@/types/scene'

interface SceneStore extends SceneState {
  updateRoom: (room: Partial<Room>) => void
  setSelectedItem: (itemId: string | null) => void
  updateCamera: (camera: Partial<Camera>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialRoom: Room = {
  id: 'room-1',
  name: 'Main Room',
  dimensions: {
    width: 10,
    height: 3,
    depth: 8
  },
  walls: [
    {
      id: 'wall-1',
      position: new Vector3(0, 1.5, -4),
      rotation: new Euler(0, 0, 0),
      width: 10,
      height: 3,
      thickness: 0.2,
      material: { color: '#ffffff' }
    },
    {
      id: 'wall-2',
      position: new Vector3(5, 1.5, 0),
      rotation: new Euler(0, Math.PI / 2, 0),
      width: 8,
      height: 3,
      thickness: 0.2,
      material: { color: '#ffffff' }
    },
    {
      id: 'wall-3',
      position: new Vector3(0, 1.5, 4),
      rotation: new Euler(0, Math.PI, 0),
      width: 10,
      height: 3,
      thickness: 0.2,
      material: { color: '#ffffff' }
    },
    {
      id: 'wall-4',
      position: new Vector3(-5, 1.5, 0),
      rotation: new Euler(0, -Math.PI / 2, 0),
      width: 8,
      height: 3,
      thickness: 0.2,
      material: { color: '#ffffff' }
    }
  ],
  floor: {
    width: 10,
    depth: 8,
    material: { color: '#f5f5f5' }
  },
  ceiling: {
    width: 10,
    depth: 8,
    height: 3,
    material: { color: '#ffffff' }
  }
}

const initialCamera: Camera = {
  position: new Vector3(8, 6, 8),
  target: new Vector3(0, 0, 0)
}

const initialState: SceneState = {
  room: initialRoom,
  furnitureItems: [],
  selectedItemId: null,
  camera: initialCamera,
  isLoading: false,
  error: null
}

export const useSceneStore = create<SceneStore>((set) => ({
  ...initialState,
  
  updateRoom: (roomUpdate) => {
    set((state) => ({
      room: { ...state.room, ...roomUpdate }
    }))
  },
  
  setSelectedItem: (itemId) => {
    set(() => ({ selectedItemId: itemId }))
  },
  
  updateCamera: (cameraUpdate) => {
    set((state) => ({
      camera: { ...state.camera, ...cameraUpdate }
    }))
  },
  
  setLoading: (loading) => {
    set(() => ({ isLoading: loading }))
  },
  
  setError: (error) => {
    set(() => ({ error }))
  },
  
  reset: () => {
    set(() => ({ ...initialState }))
  }
}))