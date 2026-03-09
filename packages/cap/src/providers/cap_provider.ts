import type { ApplicationService } from '@adonisjs/core/types'
import type { VineCapToken } from '../bindings/vinejs/binding.js'
import CapAdonisAdapter from '../cap_adonis_adapter.js'
import type { AdonisCapConfig } from '../config.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    cap: CapAdonisAdapter
  }
}

declare module '@vinejs/vine' {
  interface Vine {
    capToken(): VineCapToken
  }
}

export default class CapProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('cap', async () => {
      const router = await this.app.container.make('router')
      const config = this.app.config.get<AdonisCapConfig>('cap')

      const resolvedStore =
        'resolver' in config.store
          ? await config.store.resolver(this.app)
          : config.store()

      return new CapAdonisAdapter(config, router, resolvedStore)
    })
  }

  async boot() {
    const cap = await this.app.container.make('cap')
    await this.#registerVineJSRules(cap)
  }

  async #registerVineJSRules(cap: CapAdonisAdapter) {
    if (this.app.usingVineJS) {
      const { defineValidationRules } = await import(
        '../bindings/vinejs/binding.js'
      )
      defineValidationRules(cap)
    }
  }
}
