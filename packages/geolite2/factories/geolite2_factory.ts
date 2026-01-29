import { AppFactory } from '@adonisjs/core/factories/app'
import { HttpContextFactory } from '@adonisjs/core/factories/http'
import type { HttpContext } from '@adonisjs/core/http'
import type { ApplicationService } from '@adonisjs/core/types'
import { defineConfig } from '../src/define_config.js'
import { GeoLite2 } from '../src/geolite2.js'
import GeoLite2Manager from '../src/manager.js'
import type { GeoLite2Config } from '../src/types.js'

interface FactoryParameters {
  ctx: HttpContext
  config?: GeoLite2Config
}

export class GeoLite2Factory {
  #parameters: FactoryParameters = {
    ctx: new HttpContextFactory().create(),
  }

  #manager?: GeoLite2Manager = undefined

  #cleanup = () => {
    this.#manager?.close()
  }

  #getApp() {
    return new AppFactory().create(
      new URL('./', import.meta.url),
      () => {},
    ) as ApplicationService
  }

  merge(parameters: Partial<FactoryParameters>) {
    Object.assign(this.#parameters, parameters)
    return this
  }

  async create() {
    const config = await defineConfig(
      this.#parameters.config ?? { cache: 200, downloadDirectory: './tmp' },
    ).resolver(this.#getApp())
    this.#manager = new GeoLite2Manager(config)
    await this.#manager.init()
    return {
      geolite2: new GeoLite2(this.#parameters.ctx, this.#manager.getReaders()),
      cleanup: this.#cleanup,
    }
  }
}
