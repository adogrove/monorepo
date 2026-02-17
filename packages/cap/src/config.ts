import type { ConfigProvider } from '@adonisjs/core/types'
import type { ChallengeConfig } from '@cap.js/server'
import type Store from './stores/store.js'

export interface AdonisCapConfig {
  disableAutoCleanup: boolean
  challengeConfig: ChallengeConfig
  store: ConfigProvider<Store> | (() => Store)
}
