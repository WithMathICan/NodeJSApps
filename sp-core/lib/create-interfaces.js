'use strict'

const { createCols, findDbTables } = require('./sp-functions.js')
const fs = require('node:fs')
const path = require('node:path')
const { camelToPascalCase } = require('common')

/**
 * @param {string[]} dbSchemas
 * @param {string} database
 * @param {import('common/types').FQuery} query
 * @param {string} interfacesDir
 */
async function createInterfaces(dbSchemas, database, query, interfacesDir) {
   /**
    * @param {import('../classes/Col').Col[]} cols
    * @param {string} interfaceName
    */
   function createInterfaceByCols(cols, interfaceName) {
      const strArr = [`export interface ${interfaceName} {\n`]
      for (const col of cols) {
         const dataType = col.data_type === 'date' ? 'Date' :
            col.data_type === 'number' ? 'number' :
               col.data_type === 'id' ? 'number' : 'string'
         strArr.push(`   ${col.column_name}: ${dataType}\n`)
      }
      strArr.push('}\n\n')
      return strArr.join('')
   }

   /** @type {Record<string, string[]>} */
   const dbTables = await findDbTables(dbSchemas, query)
   for (const schema in dbTables) {
      let interfaces = ''
      for (const table of dbTables[schema]) {
         const cols = await createCols(schema, table, database, query)
         interfaces += createInterfaceByCols(cols, camelToPascalCase(`${schema}_${table}`))
      }
      await fs.promises.writeFile(path.join(interfacesDir, `${schema}.ts`), interfaces)
   }
}

module.exports = { createInterfaces }
