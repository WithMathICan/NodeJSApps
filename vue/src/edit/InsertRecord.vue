<template>
   <h2 class="font-normal text-green-500">Создание записи</h2>
   {{ bean }}
   <EditComponent
      action-type="insert"
      :bean="bean"
      :cols="cols"
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

/** @type {{schema: string, table: string}} */ //@ts-ignore
let props = defineProps(['schema', 'table'])
let router = useRouter()
let {bean, cols, init, save, isBeanChanged} = createSaveData(props, 'insert')

onMounted(() => init().then(() => isBeanChanged.value = false))
watch(() => [props.schema, props.table], init)
function onSubmit(){
   save().then(data => router.push({name: 'edit', params: {...props, id: data.id}}))
}
</script>