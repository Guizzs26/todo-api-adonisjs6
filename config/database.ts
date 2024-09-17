import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        paths: ['database/migrations'],
        naturalSort: true,
        disableRollbacksInProduction: true,
        disableTransactions: false,
      },
    },
  },
})

export default dbConfig
