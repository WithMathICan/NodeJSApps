const { createCRUD } = require('../../common')
const { createCols } = require('../lib/sp-functions')

function clearBeanFields(cols, bean) {
   for (const key in bean) if (!(key in cols)) delete bean[key]
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
   const sql = `DELETE FROM ${connectingTable} where ${bean_field}=$1 and ${m2m_filed}=$2`
   for (const id of rows.map(el => el[m2m_filed])) {
      if (!insertedValues.includes(id)) await query(sql, [bean_id, id])
   }
}

/**
 * @type {import("./sp-model.d").FCreateSpModel}
 * @param {string} schema
 * @param {string} table
 */
const createSpModel = (schema, table, PG_DATABASE, fk_title_name) => {
   /** @type {import('./sp-model').TModel} */
   class Model {
      /** @param {import("common/types").FQuery} query */
      constructor(query) {
         this.query = query
         this.crud = createCRUD(schema, table, query)
      }

      async cols() {
         /** @type {Record<string, import('../types').Col>} */
         const dbCols = await createCols(schema, table, PG_DATABASE, this.query, fk_title_name)
         return dbCols
      }

      async insert(bean) {
         const cols = await this.cols()
         clearBeanFields(cols, bean)
         let result = await this.crud.insert(bean)
         for (const col of Object.values(cols)) {
            if (col.m2m) {
               console.log('col.m2m');
               const insertedM2MValues = await insertM2M(result.id, result[col.column_name], `${col.table_name}_id`,
                  `${col.m2m.table}_id`, `${col.table_schema}.${col.m2m.connecting_table}`, this.query)
               result = await this.crud.update(result.id, { [col.column_name]: insertedM2MValues })
            }
         }
         return result
      }

      async update(id, bean) {
         const cols = await this.cols()
         clearBeanFields(cols, bean)
         let result = await this.crud.update(id, bean)
         for (const col of Object.values(cols)) {
            if (col.m2m) {
               const insertedM2MValues = await insertM2M(result.id, result[col.column_name], `${col.table_name}_id`,
                  `${col.m2m.table}_id`, `${col.table_schema}.${col.m2m.connecting_table}`, this.query)
               result = await this.crud.update(result.id, { [col.column_name]: insertedM2MValues })
               await removeUnusedM2M(result.id, result[col.column_name], `${col.table_name}_id`,
                  `${col.m2m.table}_id`, `${col.table_schema}.${col.m2m.connecting_table}`, this.query)
            }
         }
         return result
      }

      async bean(id, fields = ['*']) {
         return await this.crud.findById(id, fields)
      }

      async beans(fields = ['*']) {
         return await this.crud.queryAll(`select ${fields.join(',')} from ${this.crud.tableName} order by id desc`)
      }

      async removeMany(ids) {
         return await this.crud.removeMany(ids)
      }
   }

   return Model
}

module.exports = { createSpModel }
