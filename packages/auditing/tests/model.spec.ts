import { compose } from '@adonisjs/core/helpers'
import type { AllowedEventTypes } from '@adonisjs/events/types'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { test } from '@japa/runner'
import Audit from '../src/audit.js'
import Auditable from '../src/auditable/mixin.js'
import { resetTables, setupApp } from './helper.js'

test.group('BaseModel with auditable', () => {
  test('create event', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'
    await book.save()
    assert.isDefined(book.id)

    assert.lengthOf(await book.audits(), 1)
    const audit = await book.audits().first()
    if (audit === null) {
      assert.fail('Audit record should not be null')
      return
    }
    assert.isNotNull(audit)
    assert.equal(audit.event, 'create')
    assert.equal(audit.auditableType, 'Book')
    assert.equal(audit.auditableId, book.id)
    assert.isNull(audit.oldValues)
    assert.deepEqual(audit.newValues, { id: book.id, name: 'The Hobbit' })
  })

  test('update event', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'
    await book.save()

    book.name = 'The Lord of the Rings'
    await book.save()
    assert.isDefined(book.id)

    assert.lengthOf(await book.audits(), 2)
    const audit = await book.audits().last()
    if (audit === null) {
      assert.fail('Audit record should not be null')
      return
    }

    assert.equal(audit.event, 'update')
    assert.equal(audit.auditableType, 'Book')
    assert.equal(audit.auditableId, book.id)
    assert.deepEqual(audit.newValues, {
      id: book.id,
      name: 'The Lord of the Rings',
    })
    assert.deepEqual(audit.oldValues, { id: book.id, name: 'The Hobbit' })
  })

  test('delete event', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    assert.isUndefined(book.id)
    book.name = 'The Hobbit'
    await book.save()

    await book.delete()

    const audit = await Audit.query()
      .where('auditableType', 'Book')
      .where('auditableId', book.id)
      .orderBy('id', 'desc')
      .firstOrFail()

    assert.equal(audit.event, 'delete')
    assert.equal(audit.auditableType, 'Book')
    assert.equal(audit.auditableId, book.id)
    assert.deepEqual(audit.oldValues, { id: book.id, name: 'The Hobbit' })
    assert.isNull(audit.newValues)
  })

  test('do not audit failed operations', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    // biome-ignore lint/style/noNonNullAssertion: purposefully set non-nullable to null
    book.name = null!
    await assert.rejects(book.save)

    const audits = await Audit.query().where('auditableType', 'Book')
    assert.lengthOf(audits, 0)
  })

  test('events are emitted', async ({ assert }) => {
    const { db, emitter } = await setupApp()
    await resetTables(db)

    const eventStack: AllowedEventTypes[] = []
    emitter.onAny((event) => {
      eventStack.push(event)
    })

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()

    book.name = 'The Lord of the Rings'
    await book.save()

    await book.delete()

    assert.include(eventStack, 'audit:create')
    assert.include(eventStack, 'audit:update')
    assert.include(eventStack, 'audit:delete')
  })

  test('transition to wrong types', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    class Movie extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()
    book.name = 'The Lord of the Rings'
    await book.save()

    const movie = new Movie()
    movie.name = 'The Lord of the Rings'
    await movie.save()

    const firstVersion = await movie.audits().first()
    if (firstVersion === null) {
      assert.fail('Audit record should not be null')
      return
    }

    assert.throws(() => book.transitionTo(firstVersion, 'old'))
  })

  test('transition to wrong instance', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const bookA = new Book()
    bookA.name = 'The Hobbit'
    await bookA.save()
    bookA.name = 'The Lord of the Rings'
    await bookA.save()

    const bookB = new Book()
    bookB.name = 'Shrek'
    await bookB.save()

    const firstVersion = await bookA.audits().first()
    if (firstVersion === null) {
      assert.fail('Audit record should not be null')
      return
    }

    assert.throws(() => bookB.transitionTo(firstVersion, 'old'))
  })

  test('transition to null attributes', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()

    const firstVersion = await book.audits().first()
    if (firstVersion === null) {
      assert.fail('Audit record should not be null')
      return
    }

    assert.throws(() => book.transitionTo(firstVersion, 'old'))
  })

  test('transition to, audit has more attributes', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)
    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()
    book.name = 'The Lord of the Rings'
    await book.save()

    const firstVersion = await book.audits().first()
    if (firstVersion === null) {
      assert.fail('Audit record should not be null')
      return
    }

    // biome-ignore lint/style/noNonNullAssertion: purposefully set an extra property
    firstVersion.newValues!.extra = 'extra'
    assert.throws(() => book.transitionTo(firstVersion, 'new'))
  })

  test('revert an update', async ({ assert }) => {
    const { db } = await setupApp()
    await resetTables(db)

    class Book extends compose(BaseModel, Auditable) {
      @column()
      declare id: number

      @column()
      declare name: string
    }

    const book = new Book()
    book.name = 'The Hobbit'
    await book.save()
    book.name = 'The Lord of the Rings'
    await book.save()

    await book.revert()
    assert.equal(book.name, 'The Hobbit')
  })
})
