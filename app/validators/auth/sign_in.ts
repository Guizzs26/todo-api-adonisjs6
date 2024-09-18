import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = {
  // Applicable for all fields
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  email: 'The value is not a valid email address',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

export const signInUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
