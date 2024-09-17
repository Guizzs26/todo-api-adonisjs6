import type { HttpContext } from '@adonisjs/core/http'

export default class SignOutController {
  async signOut({ request, response }: HttpContext) {
    return response.send({
      message: 'Successfull signOut',
    })
  }
}
