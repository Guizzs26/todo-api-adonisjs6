import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SignOutController {
  async signOut({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const token = auth.user?.currentAccessToken.identifier

    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }

    await User.accessTokens.delete(user, token)

    return response.status(200).send({
      message: 'Successfully logged out',
    })
  }
}
