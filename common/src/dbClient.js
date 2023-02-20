'use strict'

/**
 * @param {import('pg').Pool} pool
 */
function initDbClientCreator(pool) {
   /** @returns {Promise<import('./dbClient').IDbClient>} */
   async function createDbClient() {
      const pgClient = await pool.connect()

      /**
       * @param {string} sql
       * @param {any[]} arr
       * @returns {Promise<import('pg').QueryResult>}
       */
      const query = (sql, arr = []) => pgClient.query(sql, arr)
      const release = () => pgClient.release()
      const beginTransaction = () => pgClient.query('BEGIN')
      const commit = () => pgClient.query('COMMIT')
      const rollback = () => pgClient.query('ROLLBACK')

      /** @type {import('./dbClient').IDbClient} */
      const obj = { release, query, beginTransaction, commit, rollback }
      return Object.freeze(obj)
   }

   return createDbClient
}

module.exports = { initDbClientCreator }
