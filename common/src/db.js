'use strict'

const { Pool } = require('pg')

const createPgPool = (/** @type {import("pg").PoolConfig} */ data) => new Pool(data)

/**
 * @param {{ connect: () => any; }} pool
 */
function initDbClientCreator(pool) {
   /** @returns {Promise<import('./db').IDbClient>} */
   async function createDbClient() {
      const pgClient = await pool.connect()

      const query = (/** @type {string} */ sql, arr = []) => pgClient.query(sql, arr)
      const release = () => pgClient.release()
      const beginTransaction = () => pgClient.query('BEGIN')
      const commit = () => pgClient.query('COMMIT')
      const rollback = () => pgClient.query('ROLLBACK')

      const obj = { release, query, beginTransaction, commit, rollback }
      return Object.freeze(obj)
   }

   return createDbClient
}

/** @type {import("./db").FCreateCRUD} */
const createCRUD = (schema, table, query) => {
   const tableName = `${schema}.${table}`
   const queryFirst = async (/** @type {string} */ sql, arr = []) => (await query(sql, arr)).rows[0]
   const queryAll = async (/** @type {string} */ sql, arr = []) => (await query(sql, arr)).rows

   return Object.freeze({
      tableName, query, queryFirst, queryAll,
      findById: (/** @type {any} */ id, /** @type {any[]} */ fields) => queryFirst(`select ${fields.join(',')} from ${tableName} where id=$1`, [id]),
      insert: ({ ...record }) => {
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
      },
      update: (/** @type {any} */ id, { ...record }) => {
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
      },
      removeMany: async (/** @type {any[]} */ ids) => {
         const nums = ids.map((/** @type {any} */ _, /** @type {number} */ i) => `$${i + 1}`);
         const sql = `DELETE FROM ${tableName} WHERE id in (${nums.join(',')}) returning id`
         const { rows } = await query(sql, ids)
         return rows.map(el => el.id)
      }
   })
}

module.exports = { createPgPool, initDbClientCreator, createCRUD }
