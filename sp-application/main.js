'use strict'

const { SpLogger, createPgPool, initDbClientCreator } = require('../common')
const { config } = require('./config.js')
const { createUploadRouter, createServer } = require('../server')
const { findDbTables, createInterfaces } = require('../sp-core')
const { fillModels } = require('./routes/models')
const { fillControllers } = require('./routes/controllers')
const { createSpRoutes } = require('./routes/sp-routes')

const PG_DATABASE = config.DB_SETTINGS.database
const pgPool = createPgPool(config.DB_SETTINGS)
const createDbClient = initDbClientCreator(pgPool)
const poolQuery = (a, b) => pgPool.query(a, b)
const logger = new SpLogger(config.RPOJECT_ROOT);
console.log({ RPOJECT_ROOT: config.RPOJECT_ROOT });

pgPool.query('SELECT 1+1').then(async () => {
   logger.log('Db connected successfully')
   createInterfaces(config.DB_SCHEMAS, PG_DATABASE, poolQuery, config.RPOJECT_ROOT + '/domain')
   const uploadRouter = createUploadRouter(poolQuery, config.UPLOADS_URL, config.PUBLIC_DIR, config.UPLOADS_SUFFIX, config.UPLOADS_SETTINGS_TABLE)
   const dbTables = await findDbTables(config.DB_SCHEMAS, poolQuery)
   fillModels(dbTables, PG_DATABASE, config.FK_TITLE_COLUMN)
   fillControllers(dbTables, createDbClient)
   const routes = createSpRoutes(dbTables, config.API_PREFIX)
   const server = createServer([config.RPOJECT_ROOT + '/public'], uploadRouter, routes, logger)
   server.listen(config.PORT)
   logger.log('Server started on port', config.PORT)
})
