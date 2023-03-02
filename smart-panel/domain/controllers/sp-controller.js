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

      const cols = async () => {
         const result = await model.cols()
         if (result.length === 0) return { statusCode: 404, message: 'Table not found', result }
         else return { statusCode: 200, message: 'OK', result }
      }

      /** @param {{id: string, fields: string[]}} args */
      const bean = async ({ id, fields = ['*'] }) => {
         const result = await model.bean(id, fields)
         if (!result) return { statusCode: 404, message: 'Bean not found', result }
         delete result['id']
         return { statusCode: 200, message: 'OK', result }
      }

      /** @param {{fields: string[]}} args */
      const beans = async ({ fields = ['*'] }) => {
         const result = await model.beans(fields)
         return { statusCode: 200, message: 'OK', result }
      }

      /** @param {import('common/types').DbRecord} record */
      const insert = async (record) => {
         const result = await model.insert(record)
         if (result) return { statusCode: 201, message: 'OK', result }
         else return { statusCode: 400, message: 'Can not insert new record', result }
      }

      /** @param {import('common/types').DbRecord} record */
      const update = async ({ id, bean }) => {
         const result = await model.update(id, bean)
         if (result) return { statusCode: 200, message: 'OK', result }
         else return { statusCode: 400, message: 'Can not update record', result }
      }

      /** @param {{ids: string[]}} args */
      const removeMany = async ({ ids }) => {
         const result = await model.removeMany(ids)
         if (ids.length > 0) return { statusCode: 200, message: 'OK', result }
         else return { statusCode: 404, message: 'Can not delete records', result }
      }

      const withErrorHandling = async (func, args = {}) => {
         try {
            return await func(args)
         } catch (/** @type {any} */ e) {
            console.error(e);
            return { statusCode: 400, message: e.message, result: null }
         }
      }

      /** @type {import('./sp-controller').ITableApi} */
      const crudApi = {
         cols: () => withErrorHandling(cols),
         bean: args => withErrorHandling(bean, args),
         beans: args => withErrorHandling(beans, args),
         insert: args => withErrorHandling(insert, args),
         update: args => withErrorHandling(update, args),
         removeMany: args => withErrorHandling(removeMany, args)
      }

      return crudApi
   }
})
