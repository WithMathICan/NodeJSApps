'use strict'

const { createSpController } = require('../../sp-core')
const { models } = require('./models')

/** @type {Record<string, import('sp-core/model/sp-controller').ITableApi>} */
const controllers = {}

/**
 * @param {Record<string, string[]>} dbTables
 * @param {import("common/types").FDbClientCreator} createDbClient
 */
function fillControllers(dbTables, createDbClient) {
   for (const key in controllers) delete controllers[key]
   for (const schema in dbTables) for (const table of dbTables[schema]) {
      const spController = createSpController(`${schema}.${table}`, models, createDbClient)
      controllers[`${schema}.${table}`] = spController
   }
}

module.exports = { controllers, fillControllers }
