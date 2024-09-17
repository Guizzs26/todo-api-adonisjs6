import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enu('name', [
          'Personal',
          'Work',
          'Study',
          'Health',
          'Hobbies',
          'Finances',
          'Home',
          'Social',
          'Planning',
        ])
        .notNullable()
        .unique()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
