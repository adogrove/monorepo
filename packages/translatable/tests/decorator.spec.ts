import { BaseModel, column } from '@adonisjs/lucid/orm'
import { test } from '@japa/runner'
import { translation } from '../index.js'
import Translation from '../src/translation.js'
import { createApp, createDatabase, createTables } from './helpers.js'

test.group('Model with decorated column', (group) => {
  group.each.setup(async (test) => {
    const app = await createApp(test)
    const database = await createDatabase(app, test)
    await createTables(database)
  })

  test('save translation', async ({ assert }) => {
    class Book extends BaseModel {
      @column()
      declare id: number

      @translation()
      declare title: Translation
    }

    const book = new Book()
    book.title = Translation.from({
      fr: 'Le Hobbit',
      en: 'The Hobbit',
      de: 'Der Hobbit',
    })
    await book.save()
    assert.isDefined(book.id)

    const actualBook = await Book.findOrFail(book.id)
    assert.deepEqual(actualBook.title, book.title)
  })

  test('get translation, exists', async ({ assert }) => {
    class Book extends BaseModel {
      @column()
      declare id: number

      @translation()
      declare title: Translation
    }

    const book = new Book()
    book.title = Translation.from({
      fr: 'Le Hobbit',
      en: 'The Hobbit',
      de: 'Der Hobbit',
    })
    await book.save()
    assert.isDefined(book.id)

    const titleFr = book.title.get('fr')
    assert.equal(titleFr, 'Le Hobbit')
  })

  test('get translation, does not exist', async ({ assert }) => {
    class Book extends BaseModel {
      @column()
      declare id: number

      @translation()
      declare title: Translation
    }

    const book = new Book()
    book.title = Translation.from({
      fr: 'Le Hobbit',
      en: 'The Hobbit',
      de: 'Der Hobbit',
    })
    await book.save()
    assert.isDefined(book.id)

    const titleIt = book.title.get('it')
    assert.isUndefined(titleIt)
  })

  test('getOrFail for locale, exist', async ({ assert }) => {
    class Book extends BaseModel {
      @column()
      declare id: number

      @translation()
      declare title: Translation
    }

    const book = new Book()
    book.title = Translation.from({
      fr: 'Le Hobbit',
      en: 'The Hobbit',
      de: 'Der Hobbit',
    })
    await book.save()
    assert.isDefined(book.id)

    assert.doesNotThrow(() => book.title.getOrFail('fr'))
  })

  test('getOrFail for locale, exist', async ({ assert }) => {
    class Book extends BaseModel {
      @column()
      declare id: number

      @translation()
      declare title: Translation
    }

    const book = new Book()
    book.title = Translation.from({
      fr: 'Le Hobbit',
      en: 'The Hobbit',
      de: 'Der Hobbit',
    })
    await book.save()
    assert.isDefined(book.id)

    assert.throws(() => book.title.getOrFail('it'))
  })

  test('set for locale, already exist, replace', async ({ assert }) => {
    class Book extends BaseModel {
      @column()
      declare id: number

      @translation()
      declare title: Translation
    }

    const book = new Book()
    book.title = Translation.from({
      fr: 'Le Hobbit',
      en: 'The Hobbit',
      de: 'Der Hobbit',
    })
    await book.save()
    assert.isDefined(book.id)

    book.title.set('fr', 'Le Bobito')
    assert.equal(book.title.get('fr'), 'Le Bobito')
  })

  test('set for locale, did not exist, set', async ({ assert }) => {
    class Book extends BaseModel {
      @column()
      declare id: number

      @translation()
      declare title: Translation
    }

    const book = new Book()
    book.title = Translation.from({
      fr: 'Le Hobbit',
      en: 'The Hobbit',
      de: 'Der Hobbit',
    })
    await book.save()
    assert.isDefined(book.id)

    book.title.set('it', 'Le Bobito')
    assert.equal(book.title.get('it'), 'Le Bobito')
  })
})
