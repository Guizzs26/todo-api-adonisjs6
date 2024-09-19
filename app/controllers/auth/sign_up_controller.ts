import type { HttpContext } from '@adonisjs/core/http'
import { signUpUserValidator } from '#validators/auth/sign_up'
import User from '#models/user'

export default class SignUpController {
  async signUp({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(signUpUserValidator, {})

    const user = await User.create({ email, password })

    return response.status(201).send({
      message: 'User created successfully',
      user,
    })
  }
}
