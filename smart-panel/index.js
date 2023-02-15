'use strict'

const { createPgPool, SpLogger } = require('../common')
// const { createIndexHtmlHandler, createStaticHandler } = require('../server/static-handler')
const { config } = require('./config')
const { createServer } = require('../server/create-server');
const { createStaticRouter } = require('../server/static-router');

const logger = new SpLogger(config.RPOJECT_ROOT);
console.log(config.RPOJECT_ROOT);

process.on('uncaughtException', err => {
   logger.log(err);
})

const pool = createPgPool(config.DB_SETTINGS)

pool.query('SELECT 1+1').then(() => {
   logger.log('Db connected successfully')
   const staticHandler = createStaticRouter(config.RPOJECT_ROOT + '/public', logger)
   const server = createServer([staticHandler], logger)
   server.listen(config.PORT)
   logger.log('Server started on port', config.PORT)
})

module.exports = { init: 5 }

