import type { HttpContext } from '@adonisjs/core/http'
import { signUpUserValidator } from '#validators/auth/sign_up'
import User from '#models/user'

export default class SignUpController {
  async signUp({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(signUpUserValidator, {
      meta: {
        userId: auth.user!.id,
      },
    })

    const user = await User.create({ email, password })

    return response.status(201).send({
      message: 'User created successfully',
      user,
    })
  }
}
