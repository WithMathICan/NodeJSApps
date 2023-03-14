const { createCRUD } = require('../../common')
const { createCols } = require('../lib/sp-functions')

function clearBeanFields(cols, bean) {
   const colsNames = cols.map(col => col.column_name)
   for (const key in bean) if (!colsNames.includes(key)) delete bean[key]
}

/**
 * @param {string} bean_id
 * @param {string[]} m2m_id_arr
 * @param {string} bean_field
 * @param {string} m2m_filed
 * @param {string} connectingTable
 * @param {import('common/types').FQuery} query
 */
async function insertM2M(bean_id, m2m_id_arr, bean_field, m2m_filed, connectingTable, query) {
   const insertedValues = []
   for (const id of m2m_id_arr) {
      const { rows } = await query(`SELECT * from ${connectingTable} where ${bean_field}=$1 and ${m2m_filed}=$2`, [bean_id, id])
      if (rows.length === 0) {
         if (await query(`INSERT INTO ${connectingTable} (${bean_field}, ${m2m_filed}) VALUES ($1, $2)`, [bean_id, id])) {
            insertedValues.push(id)
         } else throw new Error('ошибка при добавлении элемента в базу данных')
      } else insertedValues.push(id)
   }
   return insertedValues
}

/**
 * @param {string} bean_id
 * @param {string[]} insertedValues
 * @param {string} bean_field
 * @param {string} m2m_filed
 * @param {string} connectingTable
 * @param {import('common/types').FQuery} query
 */
async function removeUnusedM2M(bean_id, insertedValues, bean_field, m2m_filed, connectingTable, query) {
   const { rows } = await query(`SELECT * from ${connectingTable} where ${bean_field}=$1`, [bean_id])
   for (const id of rows) {
      const sql = `DELETE FROM ${connectingTable} where ${bean_field}=$1 and ${m2m_filed}=$2`
      if (!insertedValues.includes(id)) await query(sql, [bean_id, id])
   }
}


/**
 * @type {import("./sp-model.d").FCreateSpModel}
 * @param {string} schema
 * @param {string} table
 */
const createSpModel = (schema, table, PG_DATABASE, fk_title_name) => {
   /** @type {import("./sp-model.d").FSpModel} */
   function model(query) {
      const crud = createCRUD(schema, table, query)
      const findCols = () => createCols(schema, table, PG_DATABASE, query, fk_title_name)
      /** @type {import("./sp-model.d").ISpModel} */
      const SpModel = {
         cols: findCols,
         insert: async bean => {
            const cols = await findCols()
            clearBeanFields(cols, bean)
            let result = await crud.insert(bean)
            for (const col of cols) {
               if (col.m2m) {
                  console.log('col.m2m');
                  const insertedM2MValues = await insertM2M(result.id, result[col.column_name], `${col.table_schema}.${col.table_name}`,
                     `${col.table_schema}.${col.m2m.connecting_table}`, col.m2m.connecting_table, query)
                  result = await crud.update(result.id, { [col.column_name]: insertedM2MValues })
               }
            }
            return result
         },
         update: async (id, bean) => {
            const cols = await findCols()
            clearBeanFields(cols, bean)
            let result = await crud.update(id, bean)
            for (const col of cols) {
               if (col.m2m) {
                  console.log('col.m2m');
                  const insertedM2MValues = await insertM2M(result.id, result[col.column_name], `${col.table_schema}.${col.table_name}`,
                     `${col.table_schema}.${col.m2m.connecting_table}`, col.m2m.connecting_table, query)
                  result = await crud.update(result.id, { [col.column_name]: insertedM2MValues })
                  await removeUnusedM2M(result.id, result[col.column_name], `${col.table_schema}.${col.table_name}`,
                     `${col.table_schema}.${col.m2m.connecting_table}`, col.m2m.connecting_table, query)
               }
            }
            return result
         },
         bean: (id, fields = ['*']) => crud.findById(id, fields),
         beans: (fields = ['*']) => crud.queryAll(`select ${fields.join(',')} from ${crud.tableName} order by id desc`),
         removeMany: (ids) => crud.removeMany(ids)
      }
      return Object.freeze(SpModel)
   }
   return model
}

module.exports = { createSpModel }
