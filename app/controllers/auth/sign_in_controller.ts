import type { HttpContext } from '@adonisjs/core/http'
import { signInUserValidator } from '#validators/auth/sign_in'
import User from '#models/user'

export default class SignInController {
  async signIn({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(signInUserValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return response.status(200).send({
      message: 'Successfully logged',
      token,
    })
  }
}
