import type { ChallengeData } from '@cap.js/server'

export default abstract class Store {
  abstract challenges: {
    store: (token: string, challengeData: ChallengeData) => Promise<void>
    read: (token: string) => Promise<ChallengeData | null>
    delete: (token: string) => Promise<void>
    deleteExpired: () => Promise<void>
  }
  abstract tokens: {
    store: (tokenKey: string, expires: number) => Promise<void>
    get: (tokenKey: string) => Promise<number | null>
    delete: (tokenKey: string) => Promise<void>
    deleteExpired: () => Promise<void>
  }
}
