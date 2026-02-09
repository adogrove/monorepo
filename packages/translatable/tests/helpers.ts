import { join } from 'node:path'
import { Emitter } from '@adonisjs/core/events'
import { IgnitorFactory } from '@adonisjs/core/factories'
import { LoggerFactory } from '@adonisjs/core/factories/logger'
import type { ApplicationService } from '@adonisjs/core/types'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'
import { Database } from '@adonisjs/lucid/database'
import { BaseModel } from '@adonisjs/lucid/orm'
import type { Test } from '@japa/runner/core'

export const BASE_URL = new URL('./tmp/', import.meta.url)

export async function createApp(test: Test) {
  const { context } = test
  const { fs } = context
  await fs.mkdir(fs.basePath, { recursive: true })

  const ignitor = new IgnitorFactory()
    .withCoreConfig()
    .withCoreProviders()
    .merge({
      config: {
        i18n: defineConfig({
          formatter: formatters.icu(),
          loaders: [
            loaders.fs({
              location: BASE_URL,
            }),
          ],
        }),
      },
      rcFileContents: {
        providers: [() => import('@adonisjs/i18n/i18n_provider')],
      },
    })
    .create(fs.baseUrl)

  const app = ignitor.createApp('web')
  await app.init()
  await app.boot()
  return app
}

export async function createDatabase(app: ApplicationService, test: Test) {
  const logger = new LoggerFactory().create()
  const emitter = new Emitter(app)
  const db = new Database(
    {
      connection: 'primary',
      connections: {
        primary: {
          client: 'better-sqlite3',
          connection: {
            filename: join(test.context.fs.basePath, 'db.sqlite3'),
          },
        },
      },
    },
    logger,
    emitter,
  )

  test.cleanup(() => db.manager.closeAll())
  BaseModel.useAdapter(db.modelAdapter())
  return db
}

export async function createTables(db: Database) {
  await db.connection().schema.dropTableIfExists('books')
  await db.connection().schema.createTable('books', (table) => {
    table.increments('id')
    table.json('title').notNullable()
  })
}
