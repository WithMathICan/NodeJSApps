'use strict'

const crypto = require('node:crypto')

const md5 = data => crypto.createHash('md5').update(data).digest('hex')
const randomString = size => crypto.randomBytes(size).toString('hex')
const randomStringWithExactSize = size => randomString(size).substring(0, size)
const randomToken = size => crypto.randomBytes(size).toString('hex')
const generateUUID = () => crypto.randomUUID()

function passwordHash(password) {
   const buff = Buffer.from(password, 'utf-8');
   const hash = buff.toString('base64');
   return hash;
}

function passwordVerify(hash, password) {
   return hash === passwordHash(password)
}

module.exports = {
   md5, randomString, randomToken, generateUUID, randomStringWithExactSize,
   passwordHash, passwordVerify,
}
