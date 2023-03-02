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
   <FileUpload name="demo[]" :url="uploadUrl" @upload="onAdvancedUpload($event)" :multiple="true" accept="image/*"
      :maxFileSize="1000000">
      <template #empty>
         <p>Drag and drop files to here to upload.</p>
      </template>
   </FileUpload>

   <FileUpload name="demo[]" :customUpload="true" @uploader="myUploader" :multiple="false" accept="image/*"
      :maxFileSize="1000000">
      <template #empty>
         <p>Drag and drop files to here to upload.</p>
      </template>
   </FileUpload>
</template>

<script setup>
import FileUpload from 'primevue/fileupload'
import { API_PATH } from '../../../config'

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col'])
const uploadUrl = `${API_PATH}/${props.col.table_schema}/${props.col.table_name}/upload-file`
function onAdvancedUpload(e) {
   console.log(e);
}
async function myUploader(e) {
   console.log(e);
   const file = e.files[0]; 
   console.log(e.files[0]);
   console.log(file.name, file.type);
   console.log(file.lastModified, file.size)

   try{
      let res = await fetch(file.objectURL)
      let blob = await res.blob()
      console.log(blob)
      fetch(uploadUrl, {body: file, method: 'PUT'})
   } catch (e) {
      console.log(e);
   }
   
   // fetch(uploadUrl, {body: file, method: 'POST'})
}
</script>