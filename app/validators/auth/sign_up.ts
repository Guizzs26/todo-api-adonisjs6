import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  // Applicable for all fields
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  email: 'The value is not a valid email address',

  minLength: 'The {{ field }} field must be {{ min }} characters long',
  maxLength: 'The {{ field }} field must be {{ max }} characters long',
  confirmed: 'The {{ field }} field must be confirmed',
  unique: 'The {{ field }} field must be unique',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const signUpUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        console.log(user)
        return !user
      }),
    password: vine.string().minLength(8).maxLength(32).confirmed(),
  })
)
