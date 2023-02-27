<template>
   <h2 class="font-normal text-blue-500">Редактирование записи</h2>
   <h1 class="text-700 mb-2" :class = "{'text-pink-600': isBeanChanged}">{{ table }}</h1>
   <div class="mt-2 mb-2">
      <router-link class="link p-button" :to="{name: `view_all_${schema}_${table}`}">Все записи</router-link>
      <router-link class="link p-button p-button-warning" :to="{name: 'new', params: {schema, table}}">Создать</router-link>
   </div>
   <Card v-if="bean && cols.length>0">
      <template #content>
         <div class="text-pink-500 font-bold mb-2">
            <span :class="`opacity-${isBeanChanged ? 100 : 0}`">Есть не сохраненные изменения!</span>
         </div>
         <form  v-on:submit.prevent="save">
            <EditForm :cols="cols" :bean="bean" />
            <div class="mt-3">
               <Button label="Сохранить" :loading="loading" type="submit" icon="pi pi-save" iconPos="right" :class="`p-button-${isBeanChanged ? 'help' : 'success'} mr-1`"></Button>
               <router-link class="link p-button mr-1" :to="{name: 'copy', params: {schema, table, id}}">Копировать</router-link>
               <router-link class="link p-button p-button-warning mr-1" :to="{name: 'new', params: {schema, table}}">Создать</router-link>
               <ButtonDelete :schema="schema" :table="table" :ids="[id]" :deleteCb="viewAll" />
            </div>
            <div v-if="isBeanChanged" class="text-pink-500 font-bold mt-2">Есть не сохраненные изменения!</div>
         </form>
      </template>
   </Card>
  
</template>

<script setup>
import { watch, onMounted } from 'vue';
import {createSaveData} from './save-bean.service'
import { loading } from '../store';
import Card from 'primevue/card'
import EditForm from './edit-form/EditForm.vue';
import Button from 'primevue/button';
import ButtonDelete from './components/ButtonDelete.vue';
import { useRouter } from 'vue-router';

/** @type {{schema: string, table: string, id: string}} */ //@ts-ignore
const props = defineProps(['schema', 'table', 'id'])
const {bean, cols, init, save, isBeanChanged} = createSaveData(props, 'update')
const router = useRouter()
const viewAll = () => router.push({ name: `view_all_${props.schema}_${props.table}`})

onMounted(() => init().then(() => isBeanChanged.value = false))
watch(() => [props.table, props.schema, props.id], init)
</script>
