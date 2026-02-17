import app from '@adonisjs/core/services/app'
import type CapAdonisAdapter from '../cap_adonis_adapter.js'

let cap: CapAdonisAdapter

await app.booted(async () => {
  cap = await app.container.make('cap')
})

export { cap as default }
