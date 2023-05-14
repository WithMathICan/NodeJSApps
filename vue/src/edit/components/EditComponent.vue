<template>
   <h1 class="text-700 mb-2">{{ table }}</h1>
   <div class="mt-2 mb-2">
      <router-link class="link p-button" :to="{ name: `view_all_${schema}_${table}` }">Все записи</router-link>
      <router-link v-if="actionType === 'update'" class="link p-button p-button-warning"
         :to="{ name: 'new', params: { schema, table } }">Создать</router-link>
      <Button v-if="isBeanChanged" :loading="loading" icon="pi pi-save" class="p-button-help" @click="onSubmit"></Button>
   </div>
   <Card v-if="bean && cols.length > 0">
      <template #content>
         <div class="text-pink-500 font-bold mb-2">
            <span :class="`opacity-${isBeanChanged ? 100 : 0}`">Есть не сохраненные изменения!</span>
         </div>
         <form v-on:submit.prevent="onSubmit" ref="editForm">
            <EditForm :cols="cols" :bean="bean" />
            <div class="mt-3">
               <Button label="Сохранить" :loading="loading" type="submit" icon="pi pi-save" iconPos="right"
                  :class="saveBtnClass"></Button>
               <span v-if="actionType === 'update'">
                  <router-link class="link p-button mr-1"
                     :to="{ name: 'copy', params: { schema, table, id } }">Копировать</router-link>
                  <router-link class="link p-button p-button-warning mr-1"
                     :to="{ name: 'new', params: { schema, table } }">Создать</router-link>
                  <span class="mr-1">
                     <ButtonDelete :schema="schema" :table="table" :ids="[id]" :deleteCb="viewAll" />
                  </span>
               </span>
               <router-link v-if="id" class="link p-button mr-1" :to="{ name: `view_all_${schema}_${table}` }">Все
                  записи</router-link>
            </div>
            <div v-if="isBeanChanged" class="text-pink-500 font-bold mt-2">Есть не сохраненные изменения!</div>
         </form>
      </template>
   </Card>
</template>

<script setup>
import EditForm from '../edit-form/EditForm.vue'
import ButtonDelete from './ButtonDelete.vue';
import { loading } from '../../store'
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { computed, ref } from 'vue';

const props = defineProps(['schema', 'table', 'id', 'onSubmit', 'cols', 'bean', 'isBeanChanged', 'actionType'])
const router = useRouter()
const editForm = ref()
function triggerSubmit() {
   // console.log(editForm.value);

}
const viewAll = () => router.push({ name: `view_all_${props.schema}_${props.table}` })
const saveBtnClass = computed(() => `p-button-${props.isBeanChanged ? 'help' : 'success'} mr-1`)
</script>
