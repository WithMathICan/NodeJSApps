<template>
   <h2 class="font-normal text-blue-500">Копирование записи</h2>
   <h1 class="text-700 mb-2">{{ table }}</h1>
   <div class="mt-2 mb-2">
      <router-link class="link p-button" :to="{name: `view_all_${schema}_${table}`}">Все записи</router-link>
   </div>
   <Card v-if="bean && cols.length>0">
      <template #content>
         <div class="text-pink-500 font-bold mb-2">
            <span :class="`opacity-${isBeanChanged ? 100 : 0}`">Есть не сохраненные изменения!</span>
         </div>
         <form  v-on:submit.prevent="onSubmit">
            <EditForm :cols="cols" :bean="bean" />
            <div class="mt-3">
               <Button label="Сохранить" :loading="loading" type="submit" icon="pi pi-save" iconPos="right" class="p-button-success"></Button>
               <router-link class="link p-button" :to="{name: 'copy', params: {schema, table, id}}">Все записи</router-link>
            </div>
            <div v-if="isBeanChanged" class="text-pink-500 font-bold mt-2">Есть не сохраненные изменения!</div>
         </form>
      </template>
   </Card>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { loading } from '../store';
import Card from 'primevue/card'
import EditForm from './edit-form/EditForm.vue';
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import {createSaveData} from './save-bean.service'

/** @type {{schema: string, table: string, id: string}} */ //@ts-ignore
let props = defineProps(['schema', 'table', 'id'])
let router = useRouter()
let {bean, cols, init, save, isBeanChanged} = createSaveData(props, 'copy')

onMounted(init)
watch(() => [props.schema, props.table, props.id], init)
function onSubmit(){
   save().then(data => router.push({name: 'edit', params: {...props, id: data.id}}))
}
</script>