/**
 * @type {import('./sp-controller').FCreateSpController}
 * @param {string} tableName
 * @param {Record<string, import('./sp-model').FSpModel>} models
 * @param {import('common/types').FDbClientCreator} createDbClient
 */
const createSpController = (tableName, models, createDbClient) => {

   /** @param {(model: import('./sp-model').ISpModel) => Promise<import('./sp-controller').IApiResult<any>>} func */
   async function withTryCatch(func) {
      const dbClient = await createDbClient()
      try {
         if (!models[tableName]) throw new Error('Модель для таблицы не найденна')
         const model = models[tableName](dbClient.query)
         dbClient.beginTransaction()
         const result = await func(model)
         dbClient.commit()
         return result
      } catch (/** @type {any} */ e) {
         console.error(e);
         dbClient.rollback()
         return { statusCode: 404, message: e.message, result: [] }
      } finally {
         dbClient.release()
      }
   }

   return Object.freeze({
      cols: () => withTryCatch(async (model) => {
         let result = await model.cols()
         result = result.filter(el => el.column_name !== 'id')
         if (result.length === 0) throw new Error('Table not found')
         return { statusCode: 200, message: 'OK', result }
      }),
      bean: ({ id, fields = ['*'] }) => withTryCatch(async (model) => {
         const result = await model.bean(id, fields)
         if (!result) return { statusCode: 404, message: 'Record not found', result }
         return { statusCode: 200, message: 'OK', result }
      }),
      beans: ({ fields = ['*'] }) => withTryCatch(async model => {
         const result = await model.beans(fields)
         return { statusCode: 200, message: 'OK', result }
      }),
      insert: (record) => withTryCatch(async model => {
         const result = await model.insert(record)
         if (result) return { statusCode: 201, message: 'OK', result }
         else return { statusCode: 400, message: 'Can not insert new record', result }
      }),
      update: ({ id, bean }) => withTryCatch(async model => {
         const result = await model.update(id, bean)
         if (result) return { statusCode: 200, message: 'OK', result }
         else return { statusCode: 400, message: 'Can not update record', result }
      }),
      removeMany: ({ ids }) => withTryCatch(async model => {
         const result = await model.removeMany(ids)
         if (ids.length > 0) return { statusCode: 200, message: 'OK', result }
         else return { statusCode: 404, message: 'Can not delete records', result }
      }),
   })
}

module.exports = { createSpController }

