({
   /**
    * @type {import('./sp-upload-controller').FUploadController}
    * @param {string} file
    * @param {import('./sp-upload-controller').IAploadArgs} args
    */
   uploadController: async (file, args) => {
      //console.log({ file, args });
      try {
         const newFileName = '/' + args.getParams.fileName
         await sp.fsp.rename(file, sp.UPLOADS_DIR + newFileName)
         return { result: newFileName, statusCode: 200, message: 'OK' }
      } catch (/** @type {any} */ e) {
         return { statusCode: 404, message: e.message, result: '' }
      }
   }
})
