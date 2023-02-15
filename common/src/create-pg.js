'use strict'

const { Pool } = require('pg')

/** @param {import('./create-pg').IDbSettings} data */
function createPgPool(data) {
   return new Pool(data)
}

module.exports = { createPgPool }
