/* eslint-disable camelcase */
'use strict'

const func = require('../../../common')

function beforeSave(record) {
   if (record.title.length < 3) throw new Error('Title is very short');
   record.code = func.slugify(record.title);
}

/**
 * @param {import('sp-core/model/sp-model').TModel} BaseModel
 */
function createModel(BaseModel) {
   class CityModel extends BaseModel {
      constructor(query) {
         super(query)
      }

      async cols() {
         /** @type {Record<string, import('sp-core/types').Col>}*/
         const dbCols = await super.cols()

         dbCols['tags'].data_type = 'm2m'
         dbCols['tags'].m2m = {
            table: 'tag',
            connecting_table: 'city___tag',
            title_column: 'title',
         }

         dbCols['img'].data_type = 'file'

         dbCols['attributes'].data_type = 'key-value'
         dbCols['attributes'].keyValue = {
            keys_schema_name: 'country',
            keys_table_name: 'attribute',
         }

         return dbCols
      }

      async update(id, record) {
         beforeSave(record);
         return await super.update(id, record);
      }

      async insert(record) {
         beforeSave(record);
         return await super.insert(record);
      }
   }

   return CityModel
   /** @type {import('sp-core/model/sp-model').TModel} */
   // const model = query => ({
   //    cols: async () => {
   //       /** @type {import('../../../sp-core/types').Col[]} */
   //       const cols = await BaseModel(query).cols()
   //       for (const col of cols) {
   //          if (col.column_name === 'tags') {
   //             col.m2m = {
   //                table: 'tags',
   //                connecting_table: 'city___tags',
   //                title_column: 'title',
   //             }
   //             col.data_type = 'm2m'
   //          }
   //          if (col.column_name === 'img') col.data_type = 'file'
   //          if (col.column_name === 'attributes') {
   //             col.data_type = 'key-value'
   //             col.keyValue = {
   //                keys_schema_name: 'country',
   //                keys_table_name: 'attribute',
   //             }
   //          }
   //       }
   //       return cols
   //    },
   //    bean: (id, fields) => BaseModel(query).bean(id, fields),
   //    beans: (fields) => BaseModel(query).beans(fields),
   //    update: async (id, record) => {
   //       beforeSave(record);
   //       return BaseModel(query).update(id, record);
   //    },
   //    insert: async (record) => {
   //       beforeSave(record);
   //       return BaseModel(query).insert(record);
   //    },
   //    removeMany: (ids) => BaseModel(query).removeMany(ids),
   // })
   // return model
}

module.exports = createModel
