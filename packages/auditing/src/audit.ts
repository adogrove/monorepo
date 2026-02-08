import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { ModelObject } from '@adonisjs/lucid/types/model'
import type { DateTime } from 'luxon'

function auditConsumer(value: unknown) {
  if (value === null || value === undefined) {
    return null
  }
  if (typeof value === 'object') {
    return value
  }
  if (typeof value === 'string') {
    return JSON.parse(value)
  }

  console.warn('Failed to parse audit value', value)
  return null
}

export default class Audit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userType: string | null

  @column()
  declare userId: string | null

  @column()
  declare event: 'create' | 'update' | 'delete'

  @column()
  declare auditableType: string

  @column()
  declare auditableId: number

  @column({
    consume: auditConsumer,
    prepare: (value) => (value ? JSON.stringify(value) : null),
    serialize: (value) => (value ? value : null),
  })
  declare oldValues: ModelObject | null

  @column({
    consume: auditConsumer,
    prepare: (value) => (value ? JSON.stringify(value) : null),
    serialize: (value) => (value ? value : null),
  })
  declare newValues: ModelObject | null

  @column({
    consume: auditConsumer,
    prepare: (value) => (value ? JSON.stringify(value) : null),
    serialize: (value) => (value ? value : null),
  })
  declare metadata: ModelObject | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
