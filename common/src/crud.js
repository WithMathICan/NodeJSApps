'use strict'

/**
 * @type {import("./crud").FCreateCRUD}
 * @param {string} schema
 * @param {string} table
 * @param {import('./crud').FQuery} query
 * @returns {import('./crud').ICrud}
 */
const createCRUD = (schema, table, query) => {
   const tableName = `${schema}.${table}`

   /**
    * @param {string} sql
    * @param {any[]} arr
    * @returns {Promise<import('./crud').DbRecord[]>}
    */
   const queryAll = async (sql, arr = []) => (await query(sql, arr)).rows

   /**
    * @param {string} sql
    * @param {any[]} arr
    * @returns {Promise<import('./crud').DbRecord>}
    */
   const queryFirst = async (sql, arr = []) => (await query(sql, arr)).rows[0]

   /**
    * @param {string} id
    * @param {string[]} fields
    * @returns {Promise<import('./crud').DbRecord>}
    */
   const findById = (id, fields) => queryFirst(`select ${fields.join(',')} from ${tableName} where id=$1`, [id])

   /**
    * @param {import('./crud').DbRecord} record
    * @returns {Promise<import('./crud').DbRecord>}
    */
   const insert = ({ ...record }) => {
      delete record.id
      const fields = []
      const nums = []
      const args = []
      let i = 1
      for (const key in record) {
         fields.push(key)
         nums.push(`$${i++}`)
         args.push(record[key])
      }
      const sql = `INSERT INTO ${tableName} (${fields.join(',')}) VALUES (${nums.join(',')}) RETURNING *`
      return queryFirst(sql, args)
   }

   /**
    * @param {string} id
    * @param {import('./crud').DbRecord} record
    * @returns {Promise<import('./crud').DbRecord>}
    */
   const update = (id, { ...record }) => {
      delete record.id
      const delta = []
      let i = 1
      const args = []
      for (const key in record) {
         delta.push(`${key}=$${i++}`)
         args.push(record[key])
      }
      const sql = `UPDATE ${tableName} SET ${delta.join(',')} WHERE id=$${i} RETURNING *`
      args.push(id)
      return queryFirst(sql, args)
   }

   /**
    * @param {string[]} ids
    * @returns {Promise<string[]>}
    */
   const removeMany = async (ids) => {
      const nums = ids.map((_, i) => `$${i + 1}`);
      const sql = `DELETE FROM ${tableName} WHERE id in (${nums.join(',')}) returning id`
      const { rows } = await query(sql, ids)
      return rows.map(el => el.id)
   }

   /** @type {import('./crud').ICrud} */
   const obj = { tableName, query, queryAll, queryFirst, insert, update, removeMany, findById }

   return Object.freeze(obj)
}

module.exports = { createCRUD }
