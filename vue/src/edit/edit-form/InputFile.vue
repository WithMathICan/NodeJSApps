<template>
   <!-- <Card>
      <template #content>
         <label :for="col.column_name">{{ col.column_name }}<span class="text-red-500"
               v-if="!col.is_nullable">*</span></label>
         <div>
            <Button label="Загрузить файл" />
         </div>

      </template>
   </Card> -->
   <!-- <FileUpload name="demo[]" :url="uploadUrl" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*"
      :maxFileSize="1000000">
      <template #empty>
         <p>Drag and drop files to here to upload.</p>
      </template>
   </FileUpload> -->

   <FileUpload :customUpload="true" @uploader="myUploader" :multiple="false"
      :maxFileSize="100000000">
      <template #empty>
         <p>Drag and drop files to here to upload.</p>
         <Image v-if="modelValue" :src="modelValue" :alt="modelValue" width="250" preview />
      </template>
   </FileUpload>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'
import { post } from '../../api.js';
import { API_PATH } from '../../../config'

/** @type {{schema: string, table: string, field_name: string, modelValue: string}} */ // @ts-ignore
let props = defineProps(['schema', 'table', 'field_name', 'modelValue'])
// const urlToUpload = (/** @type {string} */ fileName, /** @type {string} */ fileType, /** @type {string} */ lastModified, /** @type {string} */ size) => 
   // `${API_PATH}/upload?schema=${props.schema}&table=${props.table}&field_name=${props.field_name}` +
   // `&fileName=${fileName}&fileType=${fileType}&lastModified=${lastModified}&size=${size}`;

const emit = defineEmits(['update:modelValue'])

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

async function myUploader(e) {
   const file = e.files[0]; 
   try{
      // const url = urlToUpload(file.name, file.type, file.lastModified, file.size)
      const url = `${API_PATH}/${props.schema}/${props.table}/upload`
      const data = JSON.stringify({
         fileName: file.name,
         fileType: file.type,
         lastModified: file.lastModified,
         size: file.size,
         base64: await toBase64(file)
      })
      post(url, data).then(data => {
         console.log({data});
         emit('update:modelValue', data)
         console.log({model: props.modelValue});
      })
   } catch (e) {
      console.log(e);
   }
   
   // fetch(uploadUrl, {body: file, method: 'POST'})
}
</script>
