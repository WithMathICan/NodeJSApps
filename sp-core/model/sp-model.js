const { createCRUD } = require('../../common')
const { createCols } = require('../lib/sp-functions')

/**
 * @type {import("./sp-model.d").FCreateSpModel}
 * @param {string} schema
 * @param {string} table
 */
const createSpModel = (schema, table, PG_DATABASE, fk_title_name) => {
   /** @type {import("./sp-model.d").FSpModel} */
   function model(query) {
      const crud = createCRUD(schema, table, query)
      /** @type {import("./sp-model.d").ISpModel} */
      const SpModel = {
         cols: () => createCols(schema, table, PG_DATABASE, query, fk_title_name),
         insert: bean => crud.insert(bean),
         update: (id, bean) => crud.update(id, bean),
         bean: (id, fields = ['*']) => crud.findById(id, fields),
         beans: (fields = ['*']) => crud.queryAll(`select ${fields.join(',')} from ${crud.tableName} order by id desc`),
         removeMany: (ids) => crud.removeMany(ids)
      }
      return Object.freeze(SpModel)
   }
   return model
}

module.exports = { createSpModel }
