'use strict'

const { Col } = require('./classes/Col')
const { createSpModel } = require('./model/sp-model')
const { createSpController } = require('./model/sp-controller')
const { createCols, findColumns, findDbTables } = require('./lib/sp-functions')
const { createInterfaces } = require('./lib/create-interfaces')

module.exports = {
   Col,
   createSpModel,
   createSpController,
   createCols,
   findColumns,
   findDbTables,
   createInterfaces,
}
