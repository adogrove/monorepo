import { test } from '@japa/runner'
import MemoryStore from '../../../src/stores/memory.js'

test.group('stores / memory', () => {
  test('challenges store', async ({ assert }) => {
    const store = new MemoryStore()

    const expected = {
      expires: Date.now(),
      challenge: { c: 0, d: 0, s: 0 },
    }

    await store.challenges.store('foo', expected)

    const actual = await store.challenges.read('foo')

    assert.deepEqual(actual, expected)
  })

  test('challenges read', async ({ assert }) => {
    const store = new MemoryStore()

    const expected = {
      expires: Date.now(),
      challenge: { c: 0, d: 0, s: 0 },
    }

    await store.challenges.store('foo', expected)

    const actual = await store.challenges.read('foo')

    assert.deepEqual(actual, expected)
  })

  test('challenges read null if absent', async ({ assert }) => {
    const store = new MemoryStore()

    const actual = await store.challenges.read('foo')

    assert.isNull(actual)
  })

  test('challenges delete', async ({ assert }) => {
    const store = new MemoryStore()

    const expected = {
      expires: Date.now(),
      challenge: { c: 0, d: 0, s: 0 },
    }

    await store.challenges.store('foo', expected)
    assert.deepEqual(await store.challenges.read('foo'), expected)

    await store.challenges.delete('foo')

    assert.isNull(await store.challenges.read('foo'))
  })

  test('challenges deleteExpired', async ({ assert }) => {
    const store = new MemoryStore()

    const expected = {
      expires: Date.now(),
      challenge: { c: 0, d: 0, s: 0 },
    }

    await store.challenges.store('foo', expected)
    await store.challenges.deleteExpired()

    const actual = await store.challenges.read('foo')

    assert.isNull(actual)
  })

  test('tokens store', async ({ assert }) => {
    const store = new MemoryStore()

    const expires = Date.now()

    assert.isNull(await store.tokens.get('foo'))

    await store.tokens.store('foo', expires)

    const actual = await store.tokens.get('foo')

    assert.deepEqual(actual, expires)
  })

  test('tokens get', async ({ assert }) => {
    const store = new MemoryStore()

    const expires = Date.now()

    await store.tokens.store('foo', expires)

    assert.deepEqual(await store.tokens.get('foo'), expires)
  })

  test('tokens get null if absent', async ({ assert }) => {
    const store = new MemoryStore()

    const actual = await store.tokens.get('foo')

    assert.isNull(actual)
  })

  test('tokens delete', async ({ assert }) => {
    const store = new MemoryStore()

    const expires = Date.now()

    await store.tokens.store('foo', expires)

    assert.deepEqual(await store.tokens.get('foo'), expires)

    await store.tokens.delete('foo')

    assert.isNull(await store.tokens.get('foo'))
  })

  test('tokens deleteExpired', async ({ assert }) => {
    const store = new MemoryStore()

    const expires = Date.now()

    await store.tokens.store('foo', expires)

    assert.equal(await store.tokens.get('foo'), expires)

    await store.tokens.deleteExpired()

    assert.isNull(await store.tokens.get('foo'))
  })
})
