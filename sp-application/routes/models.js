'use strict'

const path = require('node:path')
const { createSpModel } = require('../../sp-core')
const { isFileExist } = require('../../common')


/** @type {Record<string, import('sp-core/model/sp-model').TModel>} */
const models = {}

/**
 * @param {Record<string, string[]>} dbTables
 * @param {string} PG_DATABASE
 * @param {string} FK_TITLE_COLUMN
 */
async function fillModels(dbTables, PG_DATABASE, FK_TITLE_COLUMN) {
   for (const key in models) delete models[key]
   for (const schema in dbTables) for (const table of dbTables[schema]) {
      const spModel = createSpModel(schema, table, PG_DATABASE, FK_TITLE_COLUMN)
      const modelFileName = path.join(path.dirname(__dirname), 'models', schema, table + '.js')
      if (await isFileExist(modelFileName)) {
         const createModel = require(modelFileName)
         models[`${schema}.${table}`] = createModel(spModel)
      } else models[`${schema}.${table}`] = spModel
   }
}

module.exports = { models, fillModels }
