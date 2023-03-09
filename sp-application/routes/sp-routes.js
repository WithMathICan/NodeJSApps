'use strict'

const { camelToKebabCase } = require('../../common');
const { controllers } = require('./controllers')

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
 * @returns {import('server/src/router').IServerResponse<{message: string, result: any}>}
 */
const createResponse = (result, message = 'OK', statusCode = 200, headers = HEADERS) => ({
   statusCode,
   data: { result, message },
   headers
})

/**
 * @param {string} url
 * @param {boolean} isPostDataNeeded
 * @param {any} apiFunc
 */
function createApiHandler(url, isPostDataNeeded, apiFunc) {
   /** @type {import('../../server/src/router').IApiHandler} */
   const apiHandler = {
      isUrlAccepted: args => args.url === url && args.method === 'POST',
      isPostDataNeeded,
      handler: async args => {
         const resData = await apiFunc(args.postParams)
         return createResponse(resData.result, resData.message, resData.statusCode)
      }
   }

   return apiHandler
}

/**
 * @param {Record<string, string[]>} dbTables
 * @param {any} API_PREFIX
 */
function createSpRoutes(dbTables, API_PREFIX) {
   /** @type {import('../../server/src/router').IApiHandler[]} */
   const routes = [{
      isUrlAccepted: args => args.url === `${API_PREFIX}/init` && args.method === 'POST',
      isPostDataNeeded: true,
      handler: async _args => createResponse(dbTables, 'OK', 200)
   }]
   for (const schema in dbTables) for (const table of dbTables[schema]) {
      const key = `${schema}.${table}`
      if (!controllers[key]) throw new Error('Handler not found')
      for (const handlerName in controllers[key]) {
         const url = `${API_PREFIX}/${schema}/${table}/${camelToKebabCase(handlerName)}`
         const isPostDataNeeded = handlerName !== 'cols'
         routes.push(createApiHandler(url, isPostDataNeeded, controllers[key][handlerName]))
      }
   }
   return routes
}

module.exports = { createSpRoutes }
