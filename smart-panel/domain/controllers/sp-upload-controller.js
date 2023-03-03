({
   /**
    * @type {import('./sp-upload-controller').FUploadController}
    * @param {string} file
    * @param {import('./sp-upload-controller').IAploadArgs} args
    */
   uploadController: async (file, args) => {
      try {
         // console.log('uploadController');
         const newFileName = await buildFileName(args.getParams.fileName)
         await sp.fsp.rename(file, sp.UPLOADS_DIR + newFileName)
         return { result: newFileName, statusCode: 200, message: 'OK' }
      } catch (/** @type {any} */ e) {
         console.error(e);
         return { statusCode: 404, message: e.message, result: '' }
      }

      async function buildFileName(fileName) {
         const sql = `SELECT * from ${sp.UPLOADS_SETTINGS_TABLE} where schema_name=$1 and table_name=$2`
         console.log(sql);
         const { rows } = await sp.poolQuery(sql, [args.getParams.schema, args.getParams.table])
         /** @type {import('../country').country_uploads} */
         const data = rows[0]
         if (!data) throw new Error('Для данной таблицы не заданны параметры загрузки файлов')
         const newFileName = `/${data.files_dir}/${fileName}`
         // for (let i = 0; i < 3; i++) {
         //    if (await sp.func.isFileExist(sp.UPLOADS_DIR + newFileName)) {
         //       newFileName += '-' + sp.func.randomString(3)
         //    }
         // }
         if (await sp.func.isFileExist(sp.UPLOADS_DIR + newFileName)) {
            throw new Error('Не удалось сохранить файл, так как файл с таким именем уже существует')
         }
         return newFileName
      }
   }
})
