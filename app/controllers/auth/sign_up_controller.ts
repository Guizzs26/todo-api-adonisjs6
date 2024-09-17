import type { HttpContext } from '@adonisjs/core/http'

export default class SignUpController {
  async signUp({ request, response }: HttpContext) {
    return response.send({
      message: 'User created',
    })
  }
}
