'use strict'

const { createSpModel } = require('../../sp-core')

/** @type {Record<string, import('sp-core/model/sp-model').FSpModel>} */
const models = {}

/**
 * @param {Record<string, string[]>} dbTables
 * @param {string} PG_DATABASE
 * @param {string} FK_TITLE_COLUMN
 */
function fillModels(dbTables, PG_DATABASE, FK_TITLE_COLUMN) {
   for (const key in models) delete models[key]
   for (const schema in dbTables) for (const table of dbTables[schema]) {
      const spModel = createSpModel(schema, table, PG_DATABASE, FK_TITLE_COLUMN)
      models[`${schema}.${table}`] = spModel
   }
}

module.exports = { models, fillModels }
