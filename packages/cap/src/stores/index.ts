import { configProvider } from '@adonisjs/core'
import MemoryStore from './memory.js'

export const stores = {
  memory() {
    return configProvider.create(async () => {
      return new MemoryStore()
    })
  },
}
