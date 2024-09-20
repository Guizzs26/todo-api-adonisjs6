import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

const resource = '/auth/signUp'

test.group('creating user', () => {
  test('should fail when email is missing', async ({ client }) => {
    const response = await client.post(resource).json({
      password: 'secret123',
      password_confirmation: 'secret123',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'email',
          message: 'The email field is required',
        },
      ],
    })
  })

  test('should fail when password is missing', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'user@example.com',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'password',
          message: 'The password field is required',
        },
      ],
    })
  })

  test('should fail when password confirmation is missing', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'user@example.com',
      password: '12345678',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'required',
          field: 'password_confirmation',
          message: 'The password_confirmation field is required',
        },
      ],
    })
  })

  test('should fail when an invalid email is provided', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'invalid-email',
      password: 'secret123',
      password_confirmation: 'secret123',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'email',
          field: 'email',
          message: 'The email must be a valid email address',
        },
      ],
    })
  })

  test('should fail when password is less than 8 characters', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'user@example.com',
      password: 'secret123',
      password_confirmation: 'secret123',
    })

    response.assertStatus(422)

    response.assertBodyContains({
      errors: [
        {
          rule: 'minLength',
          field: 'password',
          message: 'The password must be at least 8 characters long',
        },
      ],
    })
  })

  test('should fail when password is more than 32 characters', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'user@example.com',
      password: 'a'.repeat(33),
      password_confirmation: 'a'.repeat(33),
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'maxLength',
          field: 'password',
          message: 'The password cannot be longer than 32 characters',
        },
      ],
    })
  })

  test('should fail when password and password_confirmation do not match', async ({ client }) => {
    const response = await client.post(resource).json({
      email: 'user@example.com',
      password: 'validpassword',
      password_confirmation: 'differentpassword',
    })

    response.assertStatus(400)

    response.assertBodyContains({
      errors: [
        {
          rule: 'confirmed',
          field: 'password',
          message: 'Password confirmation does not match',
        },
      ],
    })
  })

  test('Created user - should pass when valid email, password, and password_confirmation are provided', async ({
    client,
  }) => {
    const response = await client.post(resource).json({
      email: 'user@example.com',
      password: 'validpassword123',
      password_confirmation: 'validpassword123',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'User created successfully',
      user: {
        email: 'user@example.com',
        id: (value: number) => typeof value === 'number',
        createdAt: (value: Date) => !!value,
        updatedAt: (value: Date) => !!value,
      },
    })
  })

  test('should fail when email is already registered', async ({ client }) => {
    await client.post('/auth/signUp').json({
      email: 'user@example.com',
      password: 'validpassword',
      password_confirmation: 'validpassword',
    })

    const response = await client.post('/auth/signUp').json({
      email: 'user@example.com',
      password: 'anotherpassword',
      password_confirmation: 'anotherpassword',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          rule: 'unique',
          field: 'email',
          message: 'The email is already registered',
        },
      ],
    })
  })

  test('hashes user password', async ({ assert }) => {
    const user = new User()

    user.password = 'secret'
    user.email = 'user@example.com'

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
})
