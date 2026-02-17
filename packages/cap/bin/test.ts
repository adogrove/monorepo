import { assert } from '@japa/assert'
import { fileSystem } from '@japa/file-system'
import { configure, processCLIArgs, run } from '@japa/runner'
import { BASE_URL } from '../tests/helpers.js'

processCLIArgs(process.argv.splice(2))

configure({
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.ts'],
    },
    {
      name: 'integration',
      files: ['tests/integration/**/*.spec.ts'],
    },
  ],
  plugins: [assert(), fileSystem({ basePath: BASE_URL })],
})

run().catch(console.error)
