'use strict'

const fs = require('node:fs')

const isFileExist = (/** @type {fs.PathLike} */ file) => new Promise(resolve => {
   fs.access(file, fs.constants.F_OK, (err) => {
      if (err) resolve(false)
      resolve(true)
   })
})

module.exports = { isFileExist }
