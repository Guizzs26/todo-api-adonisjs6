import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Task from './task.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name:
    | 'Personal'
    | 'Work'
    | 'Study'
    | 'Health'
    | 'Hobbies'
    | 'Finances'
    | 'Home'
    | 'Social'
    | 'Planning'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>
}
