import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

const resource = '/auth/signUp'

test.group('creating user (sign-up)', () => {
  test('should fail when email is missing', async ({ client }) => {
    const payload = {
      password: 'secret123',
      password_confirmation: 'secret123',
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
      email: 'user@example.com',
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

  test('should fail when password confirmation is missing', async ({ client }) => {
    const payload = {
      email: 'user@example.com',
      password: '12345678',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The password field must be confirmed',
          rule: 'confirmed',
          field: 'password',
          meta: {
            otherField: 'password_confirmation',
          },
        },
      ],
    })
  })

  test('should fail when an invalid email is provided', async ({ client }) => {
    const payload = {
      email: 'invalid-email',
      password: 'secret123',
      password_confirmation: 'secret123',
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

  test('should fail when password is less than 8 characters', async ({ client }) => {
    const payload = {
      email: 'user@example.com',
      password: 'secret1',
      password_confirmation: 'secret1',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The password field must be 8 characters long',
          rule: 'minLength',
          field: 'password',
          meta: {
            min: 8,
          },
        },
      ],
    })
  })

  test('should fail when password is more than 32 characters', async ({ client }) => {
    const payload = {
      email: 'user@example.com',
      password: 'a'.repeat(33),
      password_confirmation: 'a'.repeat(33),
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The password field must be 32 characters long',
          rule: 'maxLength',
          field: 'password',
          meta: {
            max: 32,
          },
        },
      ],
    })
  })

  test('should fail when password and password_confirmation do not match', async ({ client }) => {
    const payload = {
      email: 'user@example.com',
      password: 'validpassword',
      password_confirmation: 'differentpassword',
    }

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The password field must be confirmed',
          rule: 'confirmed',
          field: 'password',
          meta: {
            otherField: 'password_confirmation',
          },
        },
      ],
    })
  })

  test('should fail when email is already registered', async ({ client }) => {
    const payload = {
      email: 'user@example.com',
      password: 'validpassword',
      password_confirmation: 'validpassword',
    }

    await client.post(resource).json(payload) // Pre-register user

    const response = await client.post(resource).json(payload)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          message: 'The email has already been taken',
          rule: 'database.unique',
          field: 'email',
        },
      ],
    })
  })

  test('should hash user password correctly', async ({ assert }) => {
    const user = new User()
    user.password = 'secret'
    user.email = 'testing@example.com'

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })

  test('should successfully create user when valid email, password and password_confirmation are provided', async ({
    client,
  }) => {
    const user = {
      email: 'newuser@example.com',
      password: 'validpassword123',
      password_confirmation: 'validpassword123',
    }

    const response = await client.post(resource).json({
      user,
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'User created successfully',
      user: {
        email: 'newuser@example.com',
        id: (value: number) => typeof value === 'number',
        createdAt: (value: Date) => !!value,
        updatedAt: (value: Date) => !!value,
      },
    })
  })
})
