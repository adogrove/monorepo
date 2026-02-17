import type { Route, Router } from '@adonisjs/core/http'
import type { HttpRouterService } from '@adonisjs/core/types'
import Cap, { type Solution } from '@cap.js/server'
import type { AdonisCapConfig } from './config.js'
import type Store from './stores/store.js'

const CapController = () => import('./controllers/cap_controller.js')

export default class CapAdonisAdapter extends Cap {
  #config: AdonisCapConfig
  #router: HttpRouterService

  constructor(config: AdonisCapConfig, router: Router, store: Store) {
    super({
      disableAutoCleanup: config.disableAutoCleanup,
      storage: store,
      noFSState: true,
    })
    this.#config = config
    this.#router = router
  }

  public registerRoutes(routeHandlerModifier?: (route: Route) => void): void {
    const challengeRoute = this.#router.post('/cap/challenge', [
      CapController,
      'challenge',
    ])
    const redeemRoute = this.#router.post('/cap/redeem', [
      CapController,
      'redeem',
    ])

    if (routeHandlerModifier) {
      routeHandlerModifier(challengeRoute)
      routeHandlerModifier(redeemRoute)
    }
  }

  public createChallenge(): Promise<{
    challenge: { c: number; s: number; d: number }
    token?: string
    expires: number
  }> {
    return super.createChallenge(this.#config.challengeConfig)
  }

  public redeemChallenge({ token, solutions }: Solution): Promise<{
    success: boolean
    message?: string
    token?: string
    expires?: number
  }> {
    return super.redeemChallenge({ token, solutions })
  }
}
