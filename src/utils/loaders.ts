import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Group, Object3D } from 'three'

class ModelLoader {
  private gltfLoader: GLTFLoader
  private readonly dracoLoader: DRACOLoader
  private loadedModels: Map<string, Group> = new Map()

  constructor() {
    this.gltfLoader = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    
    this.dracoLoader.setDecoderPath('/draco/')
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  async loadModel(path: string): Promise<Group> {
    if (this.loadedModels.has(path)) {
      const cached = this.loadedModels.get(path)!
      return cached.clone()
    }

    try {
      const gltf = await this.gltfLoader.loadAsync(path)
      const model = gltf.scene
      
      model.traverse((child: Object3D) => {
        if (child.type === 'Mesh') {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      this.loadedModels.set(path, model)
      return model.clone()
    } catch (error) {
      console.error(`Error loading model ${path}:`, error)
      throw new Error(`Failed to load model: ${path}`)
    }
  }

  preloadModels(paths: string[]): Promise<Group[]> {
    return Promise.all(paths.map(path => this.loadModel(path)))
  }

  clearCache(): void {
    this.loadedModels.clear()
  }

  dispose(): void {
    this.clearCache()
    this.dracoLoader.dispose()
  }
}

export const modelLoader = new ModelLoader()

export async function loadGLTFModel(path: string): Promise<Group> {
  return modelLoader.loadModel(path)
}

export function preloadModels(paths: string[]): Promise<Group[]> {
  return modelLoader.preloadModels(paths)
}

export function clearModelCache(): void {
  modelLoader.clearCache()
}
