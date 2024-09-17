import type { HttpContext } from '@adonisjs/core/http'

export default class SignInController {
  async signIn({ request, response }: HttpContext) {
    response.send({
      message: 'Successfull logged!',
    })
  }
}
