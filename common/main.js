'use strict'

const { slugify } = require('./src/slugify.js')
const { createPgPool } = require('./src/create-pg.js')
const { SpLogger } = require('./src/logger.js')
const { createCRUD } = require('./src/crud.js')
const load = require('./src/load.js')

module.exports = {
   SpLogger,
   slugify,
   createPgPool,
   createCRUD,
   load,
}
