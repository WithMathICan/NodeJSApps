/* eslint-disable camelcase */
'use strict'

const { passwordHash } = require('../../../common')

/**
 * @param {import('sp-core/model/sp-model').TModel} BaseModel
 */
function createModel(BaseModel) {
   class UserModel extends BaseModel {
      constructor(query) {
         super(query)
      }

      async cols() {
         /** @type {Record<string, import('sp-core/types').Col>}*/
         const dbCols = await super.cols()
         dbCols['groups'].data_type = 'm2m'
         dbCols['groups'].m2m = {
            table: 'group',
            connecting_table: 'user___group',
            title_column: 'title',
            isTree: false,
         }
         return dbCols
      }

      /** @param {import('../../domain/Secret').ISecretUser} bean */
      async insert(bean) {
         bean.password = passwordHash(bean.password)
         return super.insert(bean)
      }

      // /** @param {import('../../domain/Secret').ISecretUser} bean */
      // async update(id, bean) {
      //    bean.password = passwordHash(bean.password)
      //    return super.update(id, bean)
      // }
   }
   return UserModel
}

module.exports = createModel
