import type ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  await codemods.makeUsingStub(stubsRoot, 'config.stub', {})

  // add provider and directory to rc file
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@stouder-io/adonis-geolite2/geolite2_provider')
  })
}
