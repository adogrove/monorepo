import MemoryStore from '../src/stores/memory.js'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, BASE_URL).href)
  }
  return import(filePath)
}

export const FakeStore = MemoryStore
