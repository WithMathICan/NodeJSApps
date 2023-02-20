'use strict'

const { createCols, findDbTables } = require('./sp-functions.js')
const fs = require('node:fs')
const path = require('node:path')

/**
 * @param {string[]} dbSchemas
 * @param {string} database
 * @param {import('./sp-functions').TQuery} query
 * @param {string} dbDir
 */
async function createInterfaces(dbSchemas, database, query, dbDir) {
   /**
    * @param {string} schema
    * @param {string} table
    * @returns {Promise<string>}
    */
   async function createInterfaceByCols(schema, table) {
      /** @type {import('../classes/Col').Col[]} */
      const cols = await createCols(schema, table, database, query)
      let str = `export interface ${schema}_${table}{\n`
      for (const col of cols) {
         const dataType = col.data_type === 'date' ? 'Date' :
            col.data_type === 'number' ? 'number' :
               col.data_type === 'id' ? 'number' : 'string'
         str += `   ${col.column_name}: ${dataType}`
         str += '\n'
      }
      str += '}\n'
      return str
   }

   /** @type {Record<string, string[]>} */
   const dbTables = await findDbTables(dbSchemas, query)
   for (const schema in dbTables) {
      let interfaces = ''
      for (const table of dbTables[schema]) {
         interfaces += await createInterfaceByCols(schema, table) + '\n'
      }
      await fs.promises.writeFile(path.join(dbDir, `${schema}.ts`), interfaces)
   }
}

module.exports = { createInterfaces }
