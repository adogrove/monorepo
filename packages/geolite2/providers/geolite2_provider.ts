import { configProvider } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import type { ApplicationService } from '@adonisjs/core/types'
import { RuntimeException } from '@poppinss/utils'
import { GeoLite2 } from '../src/geolite2.js'
import GeoLite2Manager from '../src/manager.js'
import type { GeoLite2Config, ResolvedGeoLite2Config } from '../src/types.js'

export default class GeoLite2Provider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(GeoLite2Manager, async () => {
      const geolite2Config = this.app.config.get<GeoLite2Config>('geolite2')
      const config = await configProvider.resolve<ResolvedGeoLite2Config>(
        this.app,
        geolite2Config,
      )

      if (!config) {
        throw new RuntimeException(
          'Invalid default export from "config/geolite2.ts" file. Make sure to use defineConfig method',
        )
      }

      return new GeoLite2Manager(config)
    })
  }

  async boot() {
    const manager = await this.app.container.make(GeoLite2Manager)
    await manager.init()

    HttpContext.getter(
      'geolite2',
      function (this: HttpContext) {
        return new GeoLite2(this, manager.getReaders())
      },
      true,
    )
  }

  async shutdown() {
    const manager = await this.app.container.make(GeoLite2Manager)
    manager.close()
  }
}
