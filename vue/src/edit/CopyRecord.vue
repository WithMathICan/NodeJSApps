<template>
   <h2 class="font-normal text-blue-500">Копирование записи</h2>
   <EditComponent
      action-type="copy"
      :bean="bean"
      :cols="cols"
      :id="id"
      :on-submit="onSubmit"
      :schema="schema"
      :table="table"
      :isBeanChanged="isBeanChanged"
   ></EditComponent>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {createSaveData} from './save-bean.service'
import EditComponent from './components/EditComponent.vue';

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