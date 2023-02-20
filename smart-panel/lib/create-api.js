'use strict'

const fs = require('node:fs')
const { load, createCRUD } = require('../../common')
const { findDbTables } = require('./sp-functions')


/**
 * @param {string} PG_DATABASE
 * @param {string[]} DB_SCHEMAS
 * @param {import('pg').Pool} pool
 * @param {string} domainDir
 * @param {import('common').SpLogger} console
 * @returns {Promise<import('server/router').FRouter<{message: string, result: any}>>}
 */
async function createApiRouter(PG_DATABASE, DB_SCHEMAS, pool, domainDir, console) {
   const dbTables = await findDbTables(DB_SCHEMAS, (a, b) => pool.query(a, b))

   /** @returns {import('../domain/models/sp-model').FCreateSpModel} */
   function loadSpModel() {
      const sandbox = Object.freeze({
         console: Object.freeze(console),
         sp: Object.freeze({ createCRUD, PG_DATABASE }),
      })
      const modelSrc = fs.readFileSync(domainDir + '/models/sp-model.js', { encoding: 'utf-8' })
      const { createSpModel } = load(modelSrc, sandbox)
      console.log(createSpModel);
      return createSpModel
   }

   function createApiModels() {
      /** @type {Record<string, import("../domain/models/sp-model").FSpModel>} */
      const models = {}
      const createSpModel = loadSpModel()
      const sandbox = Object.freeze({
         console: Object.freeze(console),
         sp: Object.freeze({ createSpModel }),
      })
      for (const schema in dbTables) {
         for (const table of dbTables[schema]) {
            const key = `${schema}.${table}`
            let src = `sp.createSpModel('${schema}', '${table}');`
            const fileSrc = domainDir + `/models/${schema}/${table}.js`
            if (fs.existsSync(fileSrc)) {
               src = fs.readFileSync(fileSrc, { encoding: 'utf-8' })
            }
            const model = load(src, sandbox)
            models[key] = model
         }
      }
      return Object.freeze(models)
   }

   /** @param {Record<string, import("../domain/models/sp-model").FSpModel>} models */
   function loadSpController(models) {
      const sandbox = Object.freeze({
         console: Object.freeze(console),
         sp: Object.freeze({ models }),
      })
      const controllerSrc = fs.readFileSync(domainDir + '/controllers/sp-controller.js', { encoding: 'utf-8' })
      const { createSpController } = load(controllerSrc, sandbox)
      return createSpController
   }

   function createApiControllers() {
      /** @type {Record<string, import("../domain/controllers/sp-controller").ITableApi>} */
      const controllers = {}
      const models = createApiModels()
      // console.log(models);
      const createSpController = loadSpController(models)
      const sandbox = Object.freeze({
         createSpController,
         console: Object.freeze(console),
         sp: {  }
      })
      for (const schema in dbTables) {
         for (const table of dbTables[schema]) {
            const key = `${schema}.${table}`
            controllers[key] = load(`createSpController('${schema}', '${table}');`, sandbox)
         }
      }
      return controllers
   }

   const c = createApiControllers()
   console.log(c);
   return c
}

module.exports = { createApiRouter }

