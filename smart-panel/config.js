'use strict'

/** @type {import("./config").IConfig} */
const config = {
   DB_SCHEMAS: ['public', 'country'],
   DB_SETTINGS: {
      database: 'smart',
      user: 'postgres',
      password: 'root',
      host: '127.0.0.1',
      port: 5432
   },
   PORT: 3000,
   SP_NAME: 'smart-panel',
   RPOJECT_ROOT: __dirname,
   UPLOADS_DIR: __dirname + '/public/uploads'
}

module.exports = { config }
