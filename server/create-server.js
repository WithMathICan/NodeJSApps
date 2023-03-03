'use strict'

const http = require('node:http')
const assert = require('node:assert')
const nodeUrl = require('node:url')
const fs = require('node:fs')

/**
 * @param {import('./router').IUploadRouter} uploadRouter
 * @param {import('./router').FRouter<any>[]} routers
 * @param {import('common').SpLogger} console
 * @returns {http.Server}
 */
const createServer = (uploadRouter, routers, console) => http.createServer(async (req, res) => {
   const isResJson = req.headers['accept'] === 'application/json'
   try {
      assert(req.method && req.url, 'Page not found')
      const method = req.method.toUpperCase()
      const parsedUrl = nodeUrl.parse(req.url, true)
      console.log(method, parsedUrl.path);
      assert(parsedUrl.pathname, 'Pathname is undefined')
      let resData = null
      /** @type {import('./router').IRouterArgs} */
      const args = { method, url: parsedUrl.pathname, getParams: parsedUrl.query }
      if (uploadRouter.isUrlAccepted(args)) {
         const tempFile = uploadRouter.findNameForTemporaryFile()
         const stream = fs.createWriteStream(tempFile)
         req.pipe(stream)
         req.on('end', async () => {
            resData = await uploadRouter.handler(tempFile, args)
            console.log({ resData });
            res.writeHead(resData.statusCode, resData.headers)
            resData.data = JSON.stringify(resData.data)
            res.end(resData.data)
         })
         return
      }
      if (['POST', 'PUT', 'PATCH'].includes(method)) args.postParams = await receiveArgs(req, console)
      for (const router of routers) {
         if (!resData) resData = await router(args)
      }
      assert(resData, `Route for url="${req.url}" not found`)
      res.writeHead(resData.statusCode, resData.headers)
      if (isResJson) resData.data = JSON.stringify(resData.data)
      res.end(resData.data)
   } catch (/** @type {any} */ e) {
      console.error(e);
      const contentType = (isResJson ? 'application/json' : 'text/html') + '; charset=UTF-8'
      res.writeHead(404, { 'Content-Type': contentType })
      if (isResJson) res.end(JSON.stringify({ message: `Page '${req.url}' NOT FOUND!` }))
      else res.end('404 Not Found');
   }
})


/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('common').SpLogger} logger
 * @returns {Promise<any>}
 */
async function receiveArgs(req, logger) {
   try {
      const buffers = [];
      for await (const chunk of req) buffers.push(chunk);
      const data = Buffer.concat(buffers).toString();
      if (!data) return {}
      const parsedData = JSON.parse(data);
      assert(typeof parsedData === 'object', 'ParsedData shold be an object')
      return parsedData
   } catch (/** @type {any} */ e) {
      logger.error(e);
      return {}
   }
}

module.exports = { createServer }
