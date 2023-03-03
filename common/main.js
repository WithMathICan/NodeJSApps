'use strict'

const { slugify } = require('./src/slugify.js')
const { createPgPool } = require('./src/create-pg.js')
const { SpLogger } = require('./src/logger.js')
const { createCRUD } = require('./src/crud.js')
const load = require('./src/load.js')
const { initDbClientCreator } = require('./src/dbClient')
const {
   kebabToCamelCase, kebabToPascalCase, kebabToSnakeCase,
   pascalToCamelCase, pascalToKebabCase, pascalToSnakeCase,
   camelToKebabCase, camelToPascalCase, camelToSnakeCase,
   snakeToCamelCase, snakeToKebabCase, snakeToPascalCase,
} = require('./src/string-cases.js')
const { md5, generateToken, randomString, generateUUID } = require('./src/crypto-functions.js')

module.exports = {
   SpLogger,
   slugify,
   createPgPool,
   createCRUD,
   load,
   initDbClientCreator,
   kebabToCamelCase,
   kebabToPascalCase,
   kebabToSnakeCase,
   pascalToCamelCase,
   pascalToKebabCase,
   pascalToSnakeCase,
   camelToKebabCase, camelToPascalCase, camelToSnakeCase,
   snakeToCamelCase,
   snakeToKebabCase,
   snakeToPascalCase,
   md5,
   generateToken,
   randomString,
   generateUUID,
}
