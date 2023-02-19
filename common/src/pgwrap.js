'use strict'

/**
 *
 * @param {import('pg').Pool} pool
 */
function createPgWrap(pool) {
   /** @returns {Promise<import('./pgwrap').IDb>} */
   async function pgwrap() {
      const pgClient = await pool.connect()

      const pgRelease = () => pgClient.release()

      /**
       * @param {string} sql
       * @param {any[]} arr
       * @returns {Promise<import('pg').QueryResult>}
       */
      const query = (sql, arr = []) => pgClient.query(sql, arr)

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

      const beginTransaction = () => pgClient.query('BEGIN')
      const commit = () => pgClient.query('COMMIT')
      const rollback = () => pgClient.query('ROLLBACK')

      /** @type {import('./pgwrap').IDb} */
      const obj = { pgRelease, query, queryAll, queryFirst, beginTransaction, commit, rollback }
      return Object.freeze(obj)
   }

   return pgwrap
}

module.exports = { createPgWrap }
