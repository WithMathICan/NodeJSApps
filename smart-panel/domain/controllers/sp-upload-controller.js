({
   /**
    * @type {import('./sp-upload-controller').FUploadController}
    * @param {string} file
    * @param {import('./sp-upload-controller').IAploadArgs} args
    */
   uploadController: async (file, args) => {
      try {
         let newFileName = '/' + args.getParams.fileName
         for (let i = 0; i < 3; i++) {
            if (await sp.func.isFileExist(sp.UPLOADS_DIR + newFileName)) {
               newFileName += '-' + sp.func.randomString(3)
            }
         }
         if (await sp.func.isFileExist(sp.UPLOADS_DIR + newFileName)) {
            throw new Error('Не удалось сохранить файл, так как файл с таким именем уже существует')
         }
         await sp.fsp.rename(file, sp.UPLOADS_DIR + newFileName)
         return { result: newFileName, statusCode: 200, message: 'OK' }
      } catch (/** @type {any} */ e) {
         return { statusCode: 404, message: e.message, result: '' }
      }
   }
})
