'use strict'

const { createInterfaces } = require('../sp-core/lib/create-interfaces')
const { SpLogger, createPgPool } = require('../common')
const { config } = require('./config.js')
const { createUploadRouter, createServer } = require('../server')

const PG_DATABASE = config.DB_SETTINGS.database
const pgPool = createPgPool(config.DB_SETTINGS)
const poolQuery = (a, b) => pgPool.query(a, b)
const logger = new SpLogger(config.RPOJECT_ROOT);
console.log({ RPOJECT_ROOT: config.RPOJECT_ROOT });

pgPool.query('SELECT 1+1').then(async () => {
   logger.log('Db connected successfully')
   createInterfaces(config.DB_SCHEMAS, PG_DATABASE, poolQuery, config.RPOJECT_ROOT + '/domain')
   // const apiRouter = await createApiRouter(PG_DATABASE, config.DB_SCHEMAS, poolQuery, config.RPOJECT_ROOT + '/domain', config.SP_NAME, logger)
   const uploadRouter = createUploadRouter(poolQuery, config.UPLOADS_URL, config.PUBLIC_DIR, config.UPLOADS_SUFFIX, config.UPLOADS_SETTINGS_TABLE)
   const server = createServer([config.RPOJECT_ROOT + '/public'], uploadRouter, apiRouter, logger)
   server.listen(config.PORT)
   logger.log('Server started on port', config.PORT)
})
