'use strict'

const { createServer } = require('./src/create-server')
const { createUploadRouter } = require('./src/upload-router')

module.exports = {
   createServer, createUploadRouter,
}
