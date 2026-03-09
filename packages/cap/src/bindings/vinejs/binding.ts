import type Cap from '@cap.js/server'
import { BaseLiteralType, symbols, Vine } from '@vinejs/vine'
import type { FieldOptions, Validation } from '@vinejs/vine/types'
import { isCapTokenRule, rules } from './rules.js'

export class VineCapToken extends BaseLiteralType<string, string, string> {
  [symbols.SUBTYPE] = 'capToken'

  #cap: Cap
  #rules: ReturnType<typeof rules>

  constructor(args: {
    options?: FieldOptions
    validations?: Validation<unknown>[]
    cap: Cap
  }) {
    super(args.options, args.validations || [])
    this.dataTypeValidator = isCapTokenRule()
    this.#cap = args.cap

    this.#rules = rules(this.#cap)
  }

  valid(options: Cap.TokenConfig = { keepToken: false }) {
    return this.use(this.#rules.validRule(options))
  }

  clone() {
    return new VineCapToken({
      options: this.cloneOptions(),
      validations: this.cloneValidations(),
      cap: this.#cap,
    }) as this
  }

  toJSONSchema() {
    return {
      type: 'string',
      format: 'cap-token',
    }
  }
}

export function defineValidationRules(cap: Cap) {
  // register macros
  Vine.macro('capToken', () => new VineCapToken({ cap }))
}
