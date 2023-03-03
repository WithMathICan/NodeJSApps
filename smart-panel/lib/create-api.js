'use strict'

const fs = require('node:fs')
// const { load, createCRUD, slugify, kebabToCamelCase, md5, isFileExist, randomString } = require('../../common')
const { findDbTables, createCols } = require('./sp-functions')
const { M2M } = require('../classes/M2M.js')
const func = require('../../common')

const HEADERS = {
   'X-XSS-Protection': '1; mode=block',
   // 'X-Content-Type-Options': 'nosniff',
   // 'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
   // 'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'POST, OPTIONS',
   'Access-Control-Allow-Headers': 'Content-Type',
   'Content-Type': 'application/json; charset=UTF-8',
};

/**
 * @param {any} result
 * @param {string} message
 * @param {number} statusCode
 * @param {Record<string, string>} headers
 * @returns {import('server/router').IServerResponse<{message: string, result: any}>}
 */
const createResponse = (result, message = 'OK', statusCode = 200, headers = HEADERS) => ({
   statusCode,
   data: { result, message },
   headers
})

/**
 * @param {string} PG_DATABASE
 * @param {string[]} DB_SCHEMAS
 * @param {import('common/types').FQuery} poolQuery
 * @param {string} domainDir
 * @param {string} SP_NAME
 * @param {import('common').SpLogger} console
 * @returns {Promise<import('server/router').FRouter<{message: string, result: any}>>}
 */
async function createApiRouter(PG_DATABASE, DB_SCHEMAS, poolQuery, domainDir, SP_NAME, console) {
   const dbTables = await findDbTables(DB_SCHEMAS, poolQuery)

   /** @returns {import('../domain/models/sp-model').FCreateSpModel} */
   function loadSpModel() {
      const sandbox = Object.freeze({
         console: Object.freeze(console),
         sp: Object.freeze({ PG_DATABASE, createCols }),
      })
      const modelFilename = domainDir + '/models/sp-model.js'
      const modelSrc = fs.readFileSync(modelFilename, { encoding: 'utf-8' })
      const { createSpModel } = func.load(modelSrc, sandbox, modelFilename)
      console.log(createSpModel);
      return createSpModel
   }

   function loadApiModels() {
      /** @type {Record<string, import("../domain/models/sp-model").FSpModel>} */
      const models = {}
      const createSpModel = loadSpModel()
      const sandbox = Object.freeze({
         console: Object.freeze(console),
         sp: Object.freeze({ createSpModel, func: Object.freeze(func), M2M }),
      })
      for (const schema in dbTables) {
         for (const table of dbTables[schema]) {
            const key = `${schema}.${table}`
            let src = `sp.createSpModel('${schema}', '${table}');`
            let fileSrc = domainDir + `/models/${schema}/${table}.js`
            if (fs.existsSync(fileSrc)) {
               src = fs.readFileSync(fileSrc, { encoding: 'utf-8' })
            } else fileSrc = domainDir + '/models/sp-model.js'
            const model = func.load(src, sandbox, fileSrc)
            models[key] = model
         }
      }
      return Object.freeze(models)
   }

   /** @param {Record<string, import("../domain/models/sp-model").FSpModel>} models */
   function loadSpController(models) {
      const sandbox = Object.freeze({
         console: Object.freeze(console),
         sp: Object.freeze({ models, func: Object.freeze(func), poolQuery }),
      })
      const controllerFile = domainDir + '/controllers/sp-controller.js'
      const controllerSrc = fs.readFileSync(controllerFile, { encoding: 'utf-8' })
      const { createSpController } = func.load(controllerSrc, sandbox, controllerFile)
      return createSpController
   }

   function loadApiControllers() {
      /** @type {Record<string, Record<string, import("../domain/controllers/sp-controller").ITableApi>>} */
      const controllers = {}
      const models = loadApiModels()
      // console.log(models);
      const createSpController = loadSpController(models)
      const sandbox = Object.freeze({
         createSpController,
         console: Object.freeze(console),
         sp: Object.freeze({  })
      })
      const controllerFile = domainDir + '/controllers/sp-controller.js'
      for (const schema in dbTables) {
         controllers[schema] = {}
         for (const table of dbTables[schema]) {
            controllers[schema][table] = func.load(`createSpController('${schema}', '${table}');`, sandbox, controllerFile)
         }
      }
      return controllers
   }

   const controllers = loadApiControllers()
   /**
    * @type {import('server/router').FRouter<{message: string, result: any}>}
    * @param {import('server/router').IRouterArgs} args
    */
   const router = async args => {
      if (args.method !== 'POST') return null
      const urlArr = args.url.split('/').filter(el => el)
      if (urlArr[0] !== 'api') return null
      if (urlArr[1] !== SP_NAME) return null
      if (urlArr[2] === 'init') return createResponse(dbTables)
      if (urlArr.length === 5) {
         const schemaHandler = controllers[urlArr[2]]
         if (!schemaHandler) return null
         const tableHandler = schemaHandler[urlArr[3]]
         if (!tableHandler) return null
         const handler = tableHandler[func.kebabToCamelCase(urlArr[4])]
         if (!handler) return null
         const resData = await handler(args.postParams)
         return createResponse(resData.result, resData.message, resData.statusCode)
      }
      return null
   }
   return router
}

/**
 * @param {import('common/types').FQuery} poolQuery
 * @param {string} domainDir
 * @param {string} SP_NAME
 * @param {string} UPLOADS_DIR
 *
 */
function createUploadRouter(poolQuery, domainDir, SP_NAME, UPLOADS_DIR) {
   /** @returns {(file: string, args: import('server/router').IRouterArgs) => Promise<import('../domain/controllers/sp-controller').IApiResult<string>> } */
   function loadUploadController() {
      const sandbox = Object.freeze({
         console: Object.freeze(console),
         sp: Object.freeze({ poolQuery, fsp: fs.promises, UPLOADS_DIR, func: Object.freeze(func) }),
      })
      const controllerFile = domainDir + '/controllers/sp-upload-controller.js'
      const controllerSrc = fs.readFileSync(controllerFile, { encoding: 'utf-8' })
      const { uploadController } = func.load(controllerSrc, sandbox, controllerFile)
      return uploadController
   }

   const uploadController = loadUploadController()
   /**
    * //@type {import('server/router').FRouter<{message: string, result: any}>}
    * @param {string} fileName
    * @param {import('server/router').IRouterArgs} args
    */
   const handler = async (fileName, args) => {
      const resData = await uploadController(fileName, args)
      return createResponse(resData.result, resData.message, resData.statusCode)
   }

   /** @param {import('server/router').IRouterArgs} args */
   const isUrlAccepted = args => {
      // console.log({args});
      if (args.method !== 'POST') return false
      const urlArr = args.url.split('/').filter(el => el)
      if (urlArr[0] !== 'api') return false
      if (urlArr[1] !== SP_NAME) return false
      if (urlArr[2] !== 'upload') return false
      return true
   }

   const findNameForTemporaryFile = () => `${UPLOADS_DIR}/tmp/${func.md5(Math.random().toString() + Date.now().toString())}`

   return {
      isUrlAccepted,
      findNameForTemporaryFile,
      handler,
   }
}

module.exports = { createApiRouter, createUploadRouter }

