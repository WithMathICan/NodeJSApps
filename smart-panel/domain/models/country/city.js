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
         /** @param {import("../../country").country_city} record */
         async update(record) {
            beforeSave(record);
            return baseModel.update(record);
         },
         /** @param {import("../../country").country_city} record */
         async insert(record) {
            beforeSave(record);
            return baseModel.insert(record);
         }
      };
      return modelObj;
   }

   return model;
})();
