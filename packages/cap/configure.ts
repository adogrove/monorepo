import type ConfigureCommand from '@adonisjs/core/commands/configure'
import string from '@adonisjs/core/helpers/string'
import { stubsRoot } from './stubs/main.js'

export const KNOWN_STORES = ['memory']

export async function configure(command: ConfigureCommand) {
  const store = await storeFlag(command)
  if (store === undefined) {
    return
  }

  const codemods = await command.createCodemods()

  await codemods.makeUsingStub(stubsRoot, 'config/cap.stub', {
    store,
  })

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@adogrove/adonis-cap/cap_provider')
  })
}

async function storeFlag(
  command: ConfigureCommand,
): Promise<string | undefined> {
  let selectedStore: string | undefined = command.parsedFlags.store

  if (selectedStore === undefined) {
    selectedStore = await command.prompt.choice(
      'Select the storage layer you want to use',
      KNOWN_STORES,
      {
        validate(value) {
          return !value ? 'Please select a store' : true
        },
      },
    )
  }

  // biome-ignore lint/style/noNonNullAssertion: never null
  if (!KNOWN_STORES.includes(selectedStore!)) {
    command.exitCode = 1
    command.logger.logError(
      `Invalid Cap store "${selectedStore}". Supported stores are: ${string.sentence(
        KNOWN_STORES,
      )}`,
    )
    return
  }

  return selectedStore
}
