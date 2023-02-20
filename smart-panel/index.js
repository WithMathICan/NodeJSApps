'use strict'

const { createPgPool, SpLogger } = require('../common')
const { config } = require('./config')
const { createServer } = require('../server/create-server');
const { createStaticRouter } = require('../server/static-router');
const { createInterfaces } = require('./lib/create-interfaces');
const { createApiRouter } = require('./lib/create-api');


const logger = new SpLogger(config.RPOJECT_ROOT);
console.log(config.RPOJECT_ROOT);

process.on('uncaughtException', err => {
   logger.log(err);
})

const pool = createPgPool(config.DB_SETTINGS)

pool.query('SELECT 1+1').then(async () => {
   logger.log('Db connected successfully')
   const PG_DATABASE = config.DB_SETTINGS.database
   createInterfaces(config.DB_SCHEMAS, PG_DATABASE, (a, b) => pool.query(a, b), config.RPOJECT_ROOT + '/domain/models')
   const staticRouter = createStaticRouter(config.RPOJECT_ROOT + '/public', logger)
   const apiRouter = await createApiRouter(PG_DATABASE, config.DB_SCHEMAS, pool, config.RPOJECT_ROOT + '/domain', logger)
   const server = createServer([staticRouter, apiRouter], logger)
   server.listen(config.PORT)
   logger.log('Server started on port', config.PORT)
})

module.exports = { init: 5 }

