import { test } from '@japa/runner'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

test.group('Auth sign up', () => {
  test('should hash user password correctly', async ({ assert }) => {
    const user = new User()

    user.password = 'secret'
    user.email = 'testing@example.com'

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
})
