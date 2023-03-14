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
         /** @type {Record<string, import('sp-core/types').Col>}*/
         const dbCols = await super.cols()
         dbCols['permissions'].data_type = 'm2m'
         dbCols['permissions'].m2m = {
            table: 'permission',
            connecting_table: 'permission___group',
            title_column: ['table_schema', 'table_name', 'permission_value'],
            isTree: true,
         }
         return dbCols
      }
   }
   return GroupModel
}

module.exports = createModel
