import { test } from '@japa/runner'
import User from '#models/user'

const resource = '/auth/signIn'

test.group('authenticate user (sign-in)', () => {
  test('should fail when email is missing', async ({ client }) => {
    const payload = {
      password: 'secret123',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email field is required',
          rule: 'required',
          field: 'email',
        },
      ],
    })
  })

  test('should fail when password is missing', async ({ client }) => {
    const payload = {
      email: 'test@gmail.com',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The password field is required',
          rule: 'required',
          field: 'password',
        },
      ],
    })
  })

  test('should fail when an invalid email is provided', async ({ client }) => {
    const payload = {
      email: 'invalid-email',
      password: 'secret123',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The value is not a valid email address',
          rule: 'email',
          field: 'email',
        },
      ],
    })
  })

  test('should fail when email is not registered', async ({ client }) => {
    const payload = {
      email: 'unregistered@example.com',
      password: 'secret123',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })

  test('should fail when password is incorrect', async ({ client }) => {
    await User.create({
      email: 'user@example.com',
      password: 'validpassword123',
    })

    const payload = {
      email: 'user@example.com',
      password: 'invalidpassword',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })

  test('should sign in successfully with valid credentials', async ({ client }) => {
    await User.create({
      email: 'uniqueusertest@example.com',
      password: 'validpassword123',
    })

    const payload = {
      email: 'uniqueusertest@example.com',
      password: 'validpassword123',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Successfully logged',
      token: {
        type: 'bearer',
        token: (value: string) => typeof value === 'string' && value.startsWith('oat_'),
        abilities: ['*'],
        expiresAt: (value: string) => !!value,
      },
    })
  })
})
