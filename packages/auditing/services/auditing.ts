import app from '@adonisjs/core/services/app'
import type { AuditingService } from '../src/types.js'

let auditing: AuditingService

await app.booted(async () => {
  auditing = await app.container.make('auditing.manager')
})

export { auditing as default }
