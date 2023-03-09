'use strict'

const API_PREFIX = 'api/smart-panel'

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
   API_PREFIX,
   UPLOADS_URL: API_PREFIX + '/upload',
   UPLOADS_SUFFIX: 'uploads',
   FK_TITLE_COLUMN: 'title',
}

module.exports = { config }
