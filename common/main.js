'use strict'

const { slugify } = require('./src/slugify.js')
const { createPgPool } = require('./src/create-pg.js')
const { SpLogger } = require('./src/logger.js')
const { createCRUD } = require('./src/crud.js')
const load = require('./src/load.js')
const { initDbClientCreator } = require('./src/dbClient')
const { kebabToCamelCase, kebabToPascalCase } = require('./src/string-cases.js')

module.exports = {
   SpLogger,
   slugify,
   createPgPool,
   createCRUD,
   load,
   initDbClientCreator,
   kebabToCamelCase,
   kebabToPascalCase,
}
