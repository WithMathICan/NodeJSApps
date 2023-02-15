'use strict'

const { slugify } = require('./src/slugify')
const { createPgPool } = require('./src/create-pg')
const { SpLogger } = require('./src/logger')
const { createCRUD } = require('./src/crud')

module.exports = {
   SpLogger,
   slugify,
   createPgPool,
   createCRUD
}
