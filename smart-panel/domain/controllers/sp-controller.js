({
   /**
    * @type {import('./sp-controller').FCreateSpController}
    * @param {string} schema
    * @param {string} table
    */
   createSpController: (schema, table) => {
      const tableName = `${schema}.${table}`;
      const fModel = sp.models[tableName]
      if (!fModel) throw new Error('Model not found')
      const model = fModel(sp.createCRUD(schema, table, sp.poolQuery))

      /** @type {import('./sp-controller').ITableApi} */
      const crudApi = {
         async cols() {
            const result = await model.cols()
            if (result.length === 0) return { statusCode: 404, message: 'Table not found', result }
            else return { statusCode: 200, message: 'OK', result }
         },

         async bean({ id, fields = ['*'] }) {
            const result = await model.bean(id, fields)
            if (result) return { statusCode: 200, message: 'OK', result }
            else return { statusCode: 404, message: 'Bean not found', result }
         },

         async beans({ fields = ['*'] }) {
            const result = await model.beans(fields)
            return { statusCode: 200, message: 'OK', result }
         },

         async insert(record) {
            console.log(record);
            const result = await model.insert(record)
            if (result) return { statusCode: 201, message: 'OK', result }
            else return { statusCode: 400, message: 'Can not insert new record', result }
         },

         async update(record) {
            const result = await model.update(record)
            if (result) return { statusCode: 200, message: 'OK', result }
            else return { statusCode: 400, message: 'Can not update record', result }
         },

         async removeMany({ ids }) {
            const result = await model.removeMany(ids)
            if (ids.length > 0) return { statusCode: 200, message: 'OK', result }
            else return { statusCode: 404, message: 'Can not delete records', result }
         }
      }

      return crudApi
   }
})
