import type Cap from '@cap.js/server'
import type { TokenConfig } from '@cap.js/server'
import vine, { BaseLiteralType, symbols, Vine } from '@vinejs/vine'
import type { FieldContext, FieldOptions, Validation } from '@vinejs/vine/types'

// Cap token type
async function isCapToken(
  _value: unknown,
  _options: unknown,
  _field: FieldContext,
) {
  return true
}
const isCapTokenRule = vine.createRule(isCapToken)

export class VineCapToken extends BaseLiteralType<string, string, string> {
  [symbols.SUBTYPE] = 'capToken'

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isCapTokenRule()
  }

  clone() {
    return new VineCapToken(
      this.cloneOptions(),
      this.cloneValidations(),
    ) as this
  }
}

export function defineValidationRules(cap: Cap) {
  // Valid rules
  async function valid(
    value: unknown,
    options: TokenConfig = { keepToken: false },
    field: FieldContext,
  ) {
    if (typeof value !== 'string') {
      return
    }

    const { success } = await cap.validateToken(value, options)

    if (!success) {
      field.report('Invalid Cap token', 'valid', field)
    }
  }
  const validRule = vine.createRule(valid)

  // register macros
  Vine.macro('capToken', () => new VineCapToken())
  VineCapToken.macro(
    'valid',
    function (this: VineCapToken, options?: TokenConfig) {
      return this.use(validRule(options))
    },
  )
}

declare module '@vinejs/vine' {
  interface Vine {
    capToken(): VineCapToken
  }
}
declare module '../bindings/vinejs.js' {
  interface VineCapToken {
    valid(options?: TokenConfig): this
  }
}
