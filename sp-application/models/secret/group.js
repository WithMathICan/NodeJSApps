/* eslint-disable camelcase */
'use strict'

/**
 * @param {import('sp-core/model/sp-model').TModel} BaseModel
 */
function createModel(BaseModel) {
   class GroupModel extends BaseModel {
      constructor(query) {
         super(query)
      }

      async cols() {
         const dbCols = await super.cols()
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
   return GroupModel
}

module.exports = createModel
