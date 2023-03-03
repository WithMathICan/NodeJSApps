'use strict'

const { createPgPool, SpLogger } = require('../common')
const { config } = require('./config')
const { createServer } = require('../server/create-server');
const { createStaticRouter } = require('../server/static-router');
const { createInterfaces } = require('./lib/create-interfaces');
const { createApiRouter, createUploadRouter } = require('./lib/create-api');

const logger = new SpLogger(config.RPOJECT_ROOT);
console.log({ RPOJECT_ROOT: config.RPOJECT_ROOT });

process.on('uncaughtException', err => {
   logger.log(err);
})

const pool = createPgPool(config.DB_SETTINGS)

pool.query('SELECT 1+1').then(async () => {
   logger.log('Db connected successfully')
   const PG_DATABASE = config.DB_SETTINGS.database
   /** @type {import('common/types').FQuery} */
   const poolQuery = (a, b) => pool.query(a, b)
   createInterfaces(config.DB_SCHEMAS, PG_DATABASE, poolQuery, config.RPOJECT_ROOT + '/domain')
   const staticRouter = createStaticRouter(config.RPOJECT_ROOT + '/public', logger)
   const apiRouter = await createApiRouter(PG_DATABASE, config.DB_SCHEMAS, poolQuery, config.RPOJECT_ROOT + '/domain', config.SP_NAME, logger)
   const uploadRouter = createUploadRouter(poolQuery, config.RPOJECT_ROOT + '/domain', config.SP_NAME, config.PUBLIC_DIR, config.UPLOADS_SETTINGS_TABLE)
   const server = createServer(uploadRouter, [staticRouter, apiRouter], logger)
   server.listen(config.PORT)
   logger.log('Server started on port', config.PORT)
})
