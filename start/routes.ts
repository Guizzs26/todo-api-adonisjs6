import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'

const SignUpController = () => import('#controllers/auth/sign_up_controller')
const SignInController = () => import('#controllers/auth/sign_in_controller')
const SignOutController = () => import('#controllers/auth/sign_out_controller')

router
  .group(() => {
    router.post('signUp', [SignUpController, 'signUp']).as('auth.signUp')
    router.post('signIn', [SignInController, 'signIn']).as('auth.signIn')
    router
      .post('signOut', [SignOutController, 'signOut'])
      .as('auth.signOut')
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('auth')
