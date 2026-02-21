import { performance } from 'node:perf_hooks'
import { solve_pow } from '@cap.js/wasm'

export default function run({
  salt,
  target,
  challengeIndex,
}: {
  salt: string
  target: string
  challengeIndex: number
}) {
  try {
    const start = performance.now()
    const nonce = Number(solve_pow(salt, target))
    const end = performance.now()

    return {
      nonce,
      challengeIndex,
      duration: (end - start) / 1000,
    }
  } catch (error) {
    throw new Error(error.message)
  }
}
