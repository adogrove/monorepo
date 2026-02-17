import { test } from '@japa/runner'
import { stores } from '../../../src/stores/index.js'

test.group('stores / index', () => {
  test('memory', async ({ assert }) => {
    assert.exists(stores.memory)
    assert.isFunction(stores.memory)
  })
})
