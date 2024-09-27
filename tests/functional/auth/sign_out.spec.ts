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

  test('should not allow access to protected routes after logout', async ({ client }) => {
    const createUserPayload = {
      email: 'testCreateUser@example.com',
      password: 'secret123456',
    }

    const user = await User.create(createUserPayload)

    const loginResponsePayload = {
      email: user.email,
      password: 'secret123456',
    }

    const loginResponse = await client.post('/auth/signIn').json(loginResponsePayload)

    const token = loginResponse.body().token.token

    await client.post('/auth/signOut').bearerToken(token)

    const protectedResponse = await client.get('/protected-route').bearerToken(token)

    protectedResponse.assertStatus(401)
    protectedResponse.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] })
  })

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

  test('should only log out the session from the current device', async ({ client }) => {
    const user = await User.create({
      email: 'testSession@example.com',
      password: 'secret123456',
    })

    const response1 = await client.post('/auth/signIn').json({
      email: user.email,
      password: 'secret123456',
    })

    const token1 = response1.body().token.token

    const response2 = await client.post('/auth/signIn').json({
      email: user.email,
      password: 'secret123456',
    })

    const token2 = response2.body().token.token

    await client.post('/auth/signOut').bearerToken(token1)

    const protectedResponse1 = await client.get('/protected-route').bearerToken(token1)
    protectedResponse1.assertStatus(401)

    const protectedResponse2 = await client.get('/protected-route').bearerToken(token2)
    protectedResponse2.assertStatus(200)
  })
})
