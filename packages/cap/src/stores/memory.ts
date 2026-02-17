import type { ChallengeData } from '@cap.js/server'
import debug from '../debug.js'
// biome-ignore lint/style/useImportType: type
import Store from './store.js'

export default class MemoryStore implements Store {
  #challenges = new Map<string, ChallengeData>()
  #tokens = new Map<string, number>()

  challenges = {
    store: async (token: string, challengeData: ChallengeData) => {
      debug('memory challenges store %s, %o', token, challengeData)
      this.#challenges.set(token, challengeData)
    },

    read: async (token: string) => {
      debug('memory challenges read %s', token)
      return this.#challenges.get(token) ?? null
    },

    delete: async (token: string) => {
      debug('memory challenges delete %s', token)
      this.#challenges.delete(token)
    },

    deleteExpired: async () => {
      const now = Date.now()
      debug('memory challenges delete with expiry > %i', now)
      for (const [token, challengeData] of this.#challenges.entries()) {
        if (challengeData.expires <= now) {
          debug('memory challenges delete %s', token)
          this.#challenges.delete(token)
        }
      }
    },
  }
  tokens = {
    store: async (token: string, expires: number) => {
      debug('memory tokens store %s that expires at %i', token, expires)
      this.#tokens.set(token, expires)
    },
    get: async (token: string) => {
      debug('memory tokens get %s', token)
      return this.#tokens.get(token) ?? null
    },
    delete: async (token: string) => {
      debug('memory tokens delete %s', token)
      this.#tokens.delete(token)
    },
    deleteExpired: async () => {
      const now = Date.now()
      debug('memory tokens delete expired %i', now)
      for (const [token, expires] of this.#tokens.entries()) {
        if (expires <= now) {
          debug('memory tokens delete %s', token)
          this.#tokens.delete(token)
        }
      }
    },
  }
}
