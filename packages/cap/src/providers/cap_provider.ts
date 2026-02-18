import type { ApplicationService } from '@adonisjs/core/types'
import CapAdonisAdapter from '../cap_adonis_adapter.js'
import type { AdonisCapConfig } from '../config.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    cap: CapAdonisAdapter
  }
}

export default class CapProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('cap', async () => {
      const router = await this.app.container.make('router')
      const config = this.app.config.get<AdonisCapConfig>('cap')

      console.log('config', config)
      const resolvedStore =
        'resolver' in config.store
          ? await config.store.resolver(this.app)
          : config.store()

      console.log('resolvedStore', resolvedStore)
      return new CapAdonisAdapter(config, router, resolvedStore)
    })
  }

  async boot() {
    const cap = await this.app.container.make('cap')
    await this.#registerVineJSRules(cap)
  }

  async #registerVineJSRules(cap: CapAdonisAdapter) {
    if (this.app.usingVineJS) {
      const { defineValidationRules } = await import('../bindings/vinejs.js')
      defineValidationRules(cap)
    }
  }
}
