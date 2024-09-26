import User from '#models/user'
import { test } from '@japa/runner'

test.group('logout user (sign-out)', () => {
  test('should log out successfully when user is authenticated', async ({ client }) => {
    const payload = {
      email: 'test@example.com',
      password: 'secret123456',
    }

    const user = await User.create(payload)

    const response = await client.post('/auth/signOut').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ message: 'Successfully logged out' })
  })

  test('should not allow access to protected routes after logout', async ({ client }) => {})

  test('should return 401 when trying to logout without authentication', async ({ client }) => {
    const response = await client.post('/auth/signOut')

    response.assertStatus(401)
    response.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] })
  })

  test('should return 401 when trying to logout with an invalid or expired token', async ({
    client,
  }) => {
    const invalidToken = 'invalidToken1231390'

    const response = await client.post('auth/signOut').bearerToken(invalidToken)

    response.assertStatus(401)
    response.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] })
  })
})
