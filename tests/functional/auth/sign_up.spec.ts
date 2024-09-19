import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

test.group('creating user', () => {
  test('fails when email is missing', async ({ client }) => {})

  test('hashes user password', async ({ assert }) => {
    const user = new User()

    user.password = 'secret'
    user.email = 'user@example.com'

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
})
