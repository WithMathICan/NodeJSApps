/* eslint-disable camelcase */
'use strict'

const func = require('../../../common')

function beforeSave(record) {
   if (record.title.length < 3) throw new Error('Title is very short');
   record.code = func.slugify(record.title);
}

/**
 * @param {import('sp-core/model/sp-model').FSpModel} baseModel
 */
function createModel(baseModel) {
   /** @type {import('sp-core/model/sp-model').FSpModel} */
   const model = query => ({
      cols: async () => {
         /** @type {import('../../../sp-core/types').Col[]} */
         const cols = await baseModel(query).cols()
         for (const col of cols) {
            if (col.column_name === 'tags') {
               col.m2m = {
                  table: 'tags',
                  connecting_table: 'city___tags',
                  title_column: 'title',
               }
               col.data_type = 'm2m'
            }
            if (col.column_name === 'img') col.data_type = 'file'
            if (col.column_name === 'attributes') {
               col.data_type = 'key-value'
               col.keyValue = {
                  keys_schema_name: 'country',
                  keys_table_name: 'attribute',
               }
            }
         }
         return cols
      },
      bean: (id, fields) => baseModel(query).bean(id, fields),
      beans: (fields) => baseModel(query).beans(fields),
      update: async (id, record) => {
         beforeSave(record);
         return baseModel(query).update(id, record);
      },
      insert: async (record) => {
         beforeSave(record);
         return baseModel(query).insert(record);
      },
      removeMany: (ids) => baseModel(query).removeMany(ids),
   })
   return model
}

module.exports = createModel
