import { RouterFactory } from '@adonisjs/core/factories/http'
import { test } from '@japa/runner'
import vine from '@vinejs/vine'
import { defineValidationRules } from '../../../src/bindings/vinejs.js'
import CapAdonisAdapter from '../../../src/cap_adonis_adapter.js'
import type { AdonisCapConfig } from '../../../src/config.js'
import MemoryStore from '../../../src/stores/memory.js'
import solve from '../../cap-helpers/cap-solver.js'

let cap: CapAdonisAdapter

test.group('vine.js binding', (group) => {
  group.each.setup(async () => {
    const config: AdonisCapConfig = {
      disableAutoCleanup: false,
      store: () => new MemoryStore(),
      challengeConfig: {
        challengeCount: 1,
        challengeSize: 1,
        challengeDifficulty: 1,
      },
    }

    const router = new RouterFactory().create()

    cap = new CapAdonisAdapter(config, router, new MemoryStore())
    defineValidationRules(cap)
  })

  group.each.teardown(async () => {
    await cap.cleanup()
  })

  test('refuse invalid token', async ({ assert }) => {
    assert.plan(1)

    const schema = vine.object({
      token: vine.capToken().valid(),
    })

    try {
      await vine.validate({ schema, data: { token: 'foo' } })
    } catch (error) {
      assert.deepEqual(error.messages, [
        {
          field: 'token',
          message: 'Invalid Cap token',
          rule: 'valid',
        },
      ])
    }
  })

  test('accept valid token', async ({ assert }) => {
    const challengeWrapper = await cap.createChallenge()
    const solutions = await solve(
      challengeWrapper.token,
      challengeWrapper.challenge,
    )

    const { success, token } = await cap.redeemChallenge({
      token: challengeWrapper.token,
      solutions,
    })

    assert.isTrue(success)

    const schema = vine.object({
      token: vine.capToken().valid(),
    })

    await vine.validate({ schema, data: { token } })
  })

  test('accept valid token, do not keep', async ({ assert }) => {
    assert.plan(2)

    const challengeWrapper = await cap.createChallenge()
    const solutions = await solve(
      challengeWrapper.token,
      challengeWrapper.challenge,
    )

    const { success, token } = await cap.redeemChallenge({
      token: challengeWrapper.token,
      solutions,
    })

    assert.isTrue(success)

    const schema = vine.object({
      token: vine.capToken().valid(),
    })

    await vine.validate({ schema, data: { token } })

    try {
      await vine.validate({ schema, data: { token: 'foo' } })
    } catch (error) {
      assert.deepEqual(error.messages, [
        {
          field: 'token',
          message: 'Invalid Cap token',
          rule: 'valid',
        },
      ])
    }
  })

  test('accept valid token, keep option', async ({ assert }) => {
    assert.plan(2)

    const challengeWrapper = await cap.createChallenge()
    const solutions = await solve(
      challengeWrapper.token,
      challengeWrapper.challenge,
    )

    const { success, token } = await cap.redeemChallenge({
      token: challengeWrapper.token,
      solutions,
    })

    assert.isTrue(success)

    const schema = vine.object({
      token: vine.capToken().valid({ keepToken: true }),
    })

    await vine.validate({ schema, data: { token } })

    try {
      await vine.validate({ schema, data: { token: 'foo' } })
    } catch (error) {
      assert.deepEqual(error.messages, [
        {
          field: 'token',
          message: 'Invalid Cap token',
          rule: 'valid',
        },
      ])
    }
  })
})
