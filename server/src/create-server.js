'use strict'

const http = require('node:http')
const assert = require('node:assert')
const nodeUrl = require('node:url')
const fs = require('node:fs')

const { createStaticServer } = require('./static-files-handler.js')

/**
 * @param {string[]} staticFolders
 * @param {import('./router').IUploadRouter} uploadRouter
 * @param {import('./router').IApiHandler[]} routes
 * @param {import('common').SpLogger} console
 * @returns {http.Server}
 */
const createServer = (staticFolders, uploadRouter, routes, console) => {
   const staticHandler = createStaticServer(staticFolders)

   return http.createServer(async (req, res) => {
      const isResJson = !!req.headers['accept']?.includes('application/json')
      try {
         assert(req.method && req.url, 'Page not found')
         const method = req.method.toUpperCase()
         const parsedUrl = nodeUrl.parse(req.url, true)
         assert(parsedUrl.pathname, 'Pathname is undefined')
         const urlArray = parsedUrl.pathname.split('/').filter(str => str !== '')
         /** @type {import('./router').IRouterArgs} */
         const args = { method, url: urlArray.join('/'), urlArray, getParams: parsedUrl.query }
         console.log(method, parsedUrl.path);

         let resData = await staticHandler(args.url)
         if (resData) {
            res.writeHead(resData.statusCode, resData.headers)
            return res.end(resData.data)
         }

         if (uploadRouter.isUrlAccepted(args)) {
            const tempFile = uploadRouter.findNameForTemporaryFile()
            const stream = fs.createWriteStream(tempFile)
            req.pipe(stream)
            req.on('end', async () => {
               resData = await uploadRouter.handler(tempFile, args)
               res.writeHead(resData.statusCode, resData.headers)
               res.end(JSON.stringify(resData.data))
            })
            return
         }

         for (const apiHandler of routes) {
            if (apiHandler.isUrlAccepted(args)) {
               if (apiHandler.isPostDataNeeded) args.postParams = await receiveArgs(req)
               args.cookies = parseCookies(req);
               resData = await apiHandler.handler(args)
               break
            }
         }

         assert(resData, `Route for url="${req.url}" not found`)
         res.writeHead(resData.statusCode, resData.headers)
         res.end(isResJson ? JSON.stringify(resData.data) : resData.data)
      } catch (/** @type {any} */ e) {
         console.error(e);
         const contentType = (isResJson ? 'application/json' : 'text/html') + '; charset=UTF-8'
         res.writeHead(404, { 'Content-Type': contentType })
         if (isResJson) res.end(JSON.stringify({ message: `Page '${req.url}' NOT FOUND!` }))
         else res.end('404 Not Found');
      }
   })

   function parseCookies(request) {
      const list = {};
      const rc = request.headers.cookie;

      rc && rc.split(';').forEach((cookie) => {
         const parts = cookie.split('=');
         list[parts.shift().trim()] = decodeURI(parts.join('='));
      });

      return list;
   }


   /**  @param {import('node:http').IncomingMessage} req */
   async function receiveArgs(req) {
      try {
         const buffers = [];
         for await (const chunk of req) buffers.push(chunk);
         const data = Buffer.concat(buffers).toString();
         if (!data) return {}
         const parsedData = JSON.parse(data);
         assert(typeof parsedData === 'object', 'ParsedData shold be an object')
         return parsedData
      } catch (/** @type {any} */ e) {
         console.error(e);
         return {}
      }
   }
}

module.exports = { createServer }
