import os from 'os'
import { Piscina } from 'piscina'

function prng(seed: string, length: number) {
  function fnv1a(str: string) {
    let hash = 2166136261
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i)
      hash +=
        (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)
    }
    return hash >>> 0
  }

  let state = fnv1a(seed)
  let result = ''

  function next() {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return state >>> 0
  }

  while (result.length < length) {
    result += next().toString(16).padStart(8, '0')
  }

  return result.slice(0, length)
}

export default async function solve(
  challenge: string | [string, string][],
  config: { c: number; s: number; d: number },
) {
  let challenges = challenge

  if (!Array.isArray(challenges)) {
    let i = 0
    challenges = Array.from({ length: config.c }, () => {
      i += 1
      return [
        prng(`${challenge}${i}`, config.s),
        prng(`${challenge}${i}d`, config.d),
      ]
    })
  }

  const total = challenges.length
  if (total === 0) return []

  const workerCount = Math.min(os.cpus().length, total)

  const piscina = new Piscina({
    filename: new URL('cap-worker.ts', import.meta.url).href,
    minThreads: workerCount,
    maxThreads: workerCount,
    idleTimeout: 10_000,
  })

  const results: number[] = new Array(total)
  let completed = 0

  try {
    await Promise.all(
      challenges.map(([salt, target], index) =>
        piscina
          .run({
            salt,
            target,
            challengeIndex: index,
          })
          .then((result) => {
            results[index] = result.nonce
            completed++
          }),
      ),
    )

    return results
  } finally {
    await piscina.destroy()
  }
}
