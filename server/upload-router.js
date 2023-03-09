'use strict'

const func = require('../common')
const fs = require('node:fs')

const HEADERS = {
   'X-XSS-Protection': '1; mode=block',
   // 'X-Content-Type-Options': 'nosniff',
   // 'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
   // 'Access-Control-Allow-Origin': '*',
   'Access-Control-Allow-Methods': 'POST, OPTIONS',
   'Access-Control-Allow-Headers': 'Content-Type',
   'Content-Type': 'application/json; charset=UTF-8',
};

const createUploadRouter = (poolQuery, UPLOADS_URL, PUBLIC_DIR, UPLOADS_SUFFIX, UPLOADS_SETTINGS_TABLE) => {

   async function buildFileName(fileName, schema, table) {
      const sql = `SELECT * from ${UPLOADS_SETTINGS_TABLE} where schema_name=$1 and table_name=$2`
      const { rows } = await poolQuery(sql, [schema, table])
      const data = rows[0]
      if (!data) throw new Error('Для данной таблицы не заданны параметры загрузки файлов')
      const newFileName = `/${data.files_dir}/${fileName}`
      return newFileName
   }

   /**
    * @param {string} file
    * @param {import('./router').IAploadArgs} args
    */
   const uploadController = async (file, args) => {
      try {
         const newFileName = await buildFileName(args.getParams.fileName)
         if (await func.isFileExist(PUBLIC_DIR + newFileName)) {
            return { result: newFileName, statusCode: 200, message: 'Файл уже существует. Загрузка не понадобилась' }
         }
         await fs.promises.rename(file, PUBLIC_DIR + newFileName)
         return { result: newFileName, statusCode: 200, message: 'OK' }
      } catch (/** @type {any} */ e) {
         console.error(e);
         return { statusCode: 404, message: e.message, result: '' }
      }
   }

   /** @type {import('./router').IUploadRouter} */
   const uploadRouter = {
      isUrlAccepted: args => args.url === UPLOADS_URL && args.method === 'POST',
      findNameForTemporaryFile: () => `${PUBLIC_DIR}/${UPLOADS_SUFFIX}/tmp/${func.randomToken(20)}`,
      handler: async (fileName, args) => {
         const { result, message } = await uploadController(fileName, args)
         return { headers: HEADERS, statusCode: 200, data: { result, message } }
      }
   }

   return uploadRouter
}

module.exports = { createUploadRouter }
