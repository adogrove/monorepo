import type { HttpContext } from '@adonisjs/core/http'
import cap from '../services/cap.js'

export default class CapController {
  challenge() {
    return cap.createChallenge()
  }

  async redeem(ctx: HttpContext) {
    const { token, solutions } = ctx.request.body()
    if (token === undefined || solutions === undefined) {
      return ctx.response.status(400).json({ success: false })
    }
    const redeemResult = await cap.redeemChallenge({ token, solutions })
    return ctx.response.json(redeemResult)
  }
}
