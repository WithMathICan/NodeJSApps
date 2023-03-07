'use strict'

const fs = require('node:fs')
const path = require('node:path')
const { snakeToPascalCase } = require('common')
const { findDbTables, findColumns  } = require('./sp-functions.js')

/** @param {import('../classes/Col').Col} col */
function findDataType(col) {
   if (col.data_type === 'date') return 'Date'
   else if (col.data_type === 'number') return 'number'
   return 'string'
}

/**
 * @param {import('../classes/Col').Col[]} cols
 * @param {string} interfaceName
 */
function createInterfaceByCols(cols, interfaceName) {
   const strArr = [`export interface ${interfaceName} {\n`]
   for (const col of cols) strArr.push(`   ${col.column_name}: ${findDataType(col)}\n`)
   strArr.push('}\n\n')
   return strArr.join('')
}

async function createInterfaces(dbSchemas, database, query, interfacesDir) {
   const dbTables = await findDbTables(dbSchemas, query)
   for (const schema in dbTables) {
      const interfaces = []
      for (const table of dbTables[schema]) {
         const cols = await findColumns(schema, table, database, query)
         interfaces.push(createInterfaceByCols(cols, snakeToPascalCase(`i_${schema}_${table}`)))
      }
      await fs.promises.writeFile(path.join(interfacesDir, `${snakeToPascalCase(schema)}.ts`), interfaces.join(''))
   }
}

module.exports = { createInterfaces }
