({
   /**
    * @type {import("./sp-model").FCreateSpModel}
    * @param {string} schema
    * @param {string} table
    */
   createSpModel: (schema, table) => {
      /**
       * @type {import("./sp-model").FSpModel}
       * @param {import('./sp-model').ICrud} crud
       */
      function model(crud) {
         /** @type {import("./sp-model").ISpModel} */
         const SpModel = {
            async cols() {
               let result = await sp.createCols(schema, table, sp.PG_DATABASE, crud.query)
               result = result.filter(el => el.column_name !== 'id')
               return result
            },
            insert: bean => crud.insert(bean),
            update: bean => crud.update(bean.id, bean),
            bean: (id, fields = ['*']) => crud.findById(id, fields),
            beans: (fields = ['*']) => crud.queryAll(`select ${fields.join(',')} from ${crud.tableName} order by id desc`),
            removeMany: (ids) => crud.removeMany(ids)
         }
         return Object.freeze(SpModel)
      }
      return model
   }
})
