(function() {
   /** @param {import("../../country").country_city} record */
   function beforeSave(record) {
      if (record.title.length < 3) throw new Error('Title is very short');
      record.code = sp.func.slugify(record.title);
   }

   /**
    * @type {import("../sp-model").FSpModel}
    * @param {import('../sp-model').ICrud} crud
    */
   const model = (crud) => {
      const baseModel = sp.createSpModel('country', 'city')(crud);

      /** @type {import("../sp-model").ISpModel} */
      const modelObj = {
         ...baseModel,
         async cols() {
            /** @type {import('../../../classes/Col').Col[]} */
            const cols = await baseModel.cols()
            for (const col of cols) {
               if (col.column_name === 'tags') {
                  col.m2m = new sp.M2M('tags', 'title', 'city___tags')
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
         async update(id, record) {
            beforeSave(record);
            return baseModel.update(id, record);
         },
         async insert(record) {
            beforeSave(record);
            return baseModel.insert(record);
         }
      };
      return modelObj;
   }

   return model;
})();
