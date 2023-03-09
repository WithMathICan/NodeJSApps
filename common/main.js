'use strict'

const { slugify } = require('./src/slugify.js')
const { SpLogger } = require('./src/logger.js')
const { createCRUD, createPgPool, initDbClientCreator } = require('./src/db.js')
const load = require('./src/load.js')
const {
   kebabToCamelCase, kebabToPascalCase, kebabToSnakeCase,
   pascalToCamelCase, pascalToKebabCase, pascalToSnakeCase,
   camelToKebabCase, camelToPascalCase, camelToSnakeCase,
   snakeToCamelCase, snakeToKebabCase, snakeToPascalCase,
} = require('./src/string-cases.js')
const { md5, randomToken, randomString, randomStringWithExactSize, generateUUID } = require('./src/crypto-functions.js')
const { isFileExist } = require('./src/fs-functions.js')

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
   randomToken,
   randomString,
   generateUUID,
   isFileExist,
   randomStringWithExactSize,
}
