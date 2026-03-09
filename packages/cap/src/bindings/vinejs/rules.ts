import type Cap from '@cap.js/server'
import type { TokenConfig } from '@cap.js/server'
import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

export const isCapTokenRule = vine.createRule(async function isCapToken(
  _value: unknown,
  _options: unknown,
  _field: FieldContext,
) {
  return true
})
export function rules(cap: Cap) {
  return {
    validRule: vine.createRule(async function valid(
      value: unknown,
      options: TokenConfig,
      field: FieldContext,
    ) {
      if (typeof value !== 'string') {
        return
      }

      const { success } = await cap.validateToken(value, options)

      if (!success) {
        field.report('Invalid Cap token', 'valid', field)
      }
    }),
  }
}
