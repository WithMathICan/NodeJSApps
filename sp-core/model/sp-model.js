/**
 * @type {import("./sp-model.d").FCreateSpModel}
 * @param {string} schema
 * @param {string} table
 */
const createSpModel = (schema, table) => {
   /** @type {import("./sp-model.d").FSpModel} */
   function model(query) {
      const crud = sp.createCRUD(schema, table, query)
      /** @type {import("./sp-model.d").ISpModel} */
      const SpModel = {
         async cols() {
            const result = await sp.createCols(schema, table, sp.PG_DATABASE, query)
            //result = result.filter(el => el.column_name !== 'id')
            return result
         },
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
