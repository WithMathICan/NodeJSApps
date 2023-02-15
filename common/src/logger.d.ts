const { Console } = require('node:console');
const fs = require('node:fs')
const path = require('node:path')

export class SpLogger {
   constructor(root: string)
   log(...args: any) 
   error(err: Error)
}
