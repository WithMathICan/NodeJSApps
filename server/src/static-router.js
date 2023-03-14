'use strict'

const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert');

/** @type {Record<string, string>} */
const MIME_TYPES = {
   html: 'text/html; charset=UTF-8',
   json: 'application/json; charset=UTF-8',
   js: 'application/javascript; charset=UTF-8',
   css: 'text/css',
   png: 'image/png',
   ico: 'image/x-icon',
   svg: 'image/svg+xml',
};

const HEADERS = {
   'X-XSS-Protection': '1; mode=block',
   'X-Content-Type-Options': 'nosniff',
   'Strict-Transport-Security': 'max-age=0; includeSubdomains; preload',
}

/**
 * @param {string} root
 * @param {string} url
 * @returns {Promise<string>}
 */
async function findFilePath(root, url) {
   let filePath = path.join(root, url);

   for (let i = 0; i < 10 && filePath.endsWith('/'); i++) filePath = filePath.slice(0, -1);
   if (filePath.endsWith('/')) throw new Error('Could not remove / from file path')

   let stat = await fs.promises.lstat(filePath);
   if (stat.isDirectory()) {
      filePath += '/index.html'
      stat = await fs.promises.lstat(filePath)
   }

   assert(stat.isFile(), 'File not found')
   return filePath
}

/**
 * @param {string} filePath
 * @returns {string}
 */
function findMimeType(filePath) {
   const fileExt = path.extname(filePath).substring(1);
   const mimeType = MIME_TYPES[fileExt] ?? MIME_TYPES.html;
   return mimeType
}

/**
 * @param {string} publicRoot
 * @param {import('common/main').SpLogger} console
 * @returns {import('./router').FRouter<any>}
*/
function createStaticRouter(publicRoot, console) {
   /**
    * @type {import('./router').FRouter<any>}
    * @param {import('./router').IRouterArgs} args
   */
   async function router({ url, method }) {
      if (method !== 'GET') return null
      try {
         const filePath = await findFilePath(publicRoot, url)
         const data = await fs.promises.readFile(filePath);
         const mimeType = findMimeType(filePath)
         return {
            headers: { ...HEADERS, 'Content-Type': mimeType },
            data,
            statusCode: 200,
         }
      } catch (/** @type {any} */ err) {
         if (err && typeof err === 'object' && 'code' in err) {
            if (err['code'] !== 'ENOENT') console.error(err);
         }
         return null
      }
   }
   return router
}

/**
 * @param {string} publicRoot
 * @param {string} urlPrefix
 * @param {import('common/main').SpLogger} console
 * @returns {import('./router').FRouter<any>}
 */
function createIndexHtmlRouter(publicRoot, urlPrefix, console) {
   /** @type {import('./router').FRouter<any>} */
   async function indexHtmlHandler({ method, url }) {
      if (method !== 'GET') return null
      try {
         if (url.startsWith('/' + urlPrefix)) {
            const filePath = path.join(publicRoot, urlPrefix, 'index.html');
            const data = await fs.promises.readFile(filePath)
            return {
               headers: { 'Content-Type': 'text/html; charset=UTF-8' },
               statusCode: 200,
               data,
            }
         }
         return null
      } catch (/** @type {any} */ err) {
         if (err && typeof err === 'object' && 'code' in err) {
            if (err['code'] !== 'ENOENT') console.error(err);
         }
         return null
      }
   }
   return indexHtmlHandler
}

module.exports = { createStaticRouter, createIndexHtmlRouter }

