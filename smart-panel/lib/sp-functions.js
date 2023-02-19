'use strict'

const { Col } = require('../classes/Col');
const { Fk } = require('../classes/Fk');


const MY_SQL_COLS = `SELECT * from information_schema.columns 
where table_catalog = $1 and table_schema = $2 and table_name = $3`;

// const MY_SQL_FK_SAME_SCHEMA = `SELECT
// tc.table_schema,
// tc.constraint_name,
// tc.table_name,
// kcu.column_name,
// ccu.table_schema AS foreign_table_schema,
// ccu.table_name AS foreign_table_name,
// ccu.column_name AS foreign_column_name
// FROM
// information_schema.table_constraints AS tc
// JOIN information_schema.key_column_usage AS kcu
// ON tc.constraint_name = kcu.constraint_name
// AND tc.table_schema = kcu.table_schema
// JOIN information_schema.constraint_column_usage AS ccu
// ON ccu.constraint_name = tc.constraint_name
// AND ccu.table_schema = tc.table_schema
// WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema=$1 AND tc.table_name=$2`

const MY_SQL_FK = `SELECT
tc.table_schema, 
tc.constraint_name, 
tc.table_name, 
kcu.column_name, 
ccu.table_schema AS foreign_table_schema,
ccu.table_name AS foreign_table_name,
ccu.column_name AS foreign_column_name 
FROM 
information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
ON tc.constraint_name = kcu.constraint_name
AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema=$1 AND tc.table_name=$2`

'use strict'

/**
* @param {string} schema
* @param {string} table
* @param {string} database
* @param {import('./sp-functions').TQuery} query
* @returns {Promise<Col[]>}
*/
async function createCols(schema, table, database, query) {
   const dbCols = await query(MY_SQL_COLS, [database, schema, table])
   const cols = dbCols.rows.map(el => new Col(el))
   const dbFkData = await query(MY_SQL_FK, [schema, table])
   /** @type {import('../classes/Fk').IFk[]} */ const dbFk = dbFkData.rows

   for (const fk of dbFk) {
      const col = cols.find(el => el.column_name === fk.column_name)
      if (col) {
         // eslint-disable-next-line camelcase
         col.data_type = 'fk'
         col.fk = new Fk(fk, 'title')
      }
   }

   return cols
}

/**
* @param {string[]} schemas
* @param {import('./sp-functions').TQuery} query
* @returns {Promise<Record<string, string[]>>}
*/
async function spFindDbTables(schemas, query) {
   /** @type {Record<string, string[]>} */
   const dbTables = {};
   for (const schema of schemas) {
      const sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = $1'
      const { rows } = await query(sql, [schema])
      if (rows.length > 0) dbTables[schema] = rows.map(el => el.table_name)
   }
   return dbTables
}

module.exports = { createCols, spFindDbTables }
