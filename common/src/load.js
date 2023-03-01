'use strict';

const vm = require('node:vm');

const RUN_OPTIONS = { timeout: 5000, displayErrors: true };

/**
 * @param {string} codeSrc
 * @param {any} sandbox
 * @param {string} filename
 */
module.exports = (codeSrc, sandbox, filename) => {
   const code = `'use strict';\n${codeSrc}`;
   const script = new vm.Script(code, {filename});
   const context = vm.createContext(sandbox);
   const exported = script.runInContext(context, {...RUN_OPTIONS, filename});
   return exported;
};
