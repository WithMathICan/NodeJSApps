/* eslint-disable camelcase */
'use strict'

/**
 * @param {import('sp-core/model/sp-model').FSpModel} baseModel
 */
function createModel(baseModel) {
   return query => {
      const model = baseModel(query)
      return {
         ...model,
         cols: async  () => {
            /** @type {import('../../../sp-core/types').Col[]} */
            const dbCols = await model.cols()
            for (const col of dbCols) {
               if (col.column_name === 'permissions') {
                  col.m2m = {
                     table: 'permission',
                     connecting_table: 'permission___group',
                     title_column: ['table_schema', 'table_name', 'permission_value'],
                     isTree: true,
                  }
                  col.data_type = 'm2m'
               }
            }
            return dbCols
         }
      }
   }
}

module.exports = createModel
