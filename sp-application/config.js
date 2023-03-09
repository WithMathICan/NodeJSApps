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
   PUBLIC_DIR: __dirname + '/public',
   UPLOADS_SETTINGS_TABLE: 'country.uploads',
   UPLOADS_URL: '/api/smart-panel/upload',
   UPLOADS_SUFFIX: 'uploads',
}

module.exports = { config }
