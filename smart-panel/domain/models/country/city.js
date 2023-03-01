(function() {
   /** @param {import("../../country").country_city} record */
   function beforeSave(record) {
      if (record.title.length < 3) throw new Error('Title is very short');
      record.code = sp.slugify(record.title);
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
            let col = cols.find(el => el.column_name === 'tags')
            if (col) {
               col.m2m = new sp.M2M('tags', 'title', 'city___tags')
               col.data_type = 'm2m'
            }
            col = cols.find(el => el.column_name === 'img')
            if (col) col.data_type = 'file'
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
