import { resolve } from 'node:path'
import { configProvider } from '@adonisjs/core'
import type { ConfigProvider } from '@adonisjs/core/types'
import type { GeoLite2Config, ResolvedGeoLite2Config } from './types.js'

export function defineConfig(
  config: GeoLite2Config,
): ConfigProvider<ResolvedGeoLite2Config> {
  return configProvider.create(async (_app) => {
    return {
      downloadDirectory: resolve(config.downloadDirectory),
      cache: config.cache,
    }
  })
}
