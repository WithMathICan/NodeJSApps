<template>
   <h2 class="font-normal text-blue-500">Редактирование записи</h2>
   <EditComponent
      action-type="update"
      :bean="bean"
      :cols="cols"
      :id="id"
      :on-submit="save"
      :schema="schema"
      :table="table"
      :isBeanChanged="isBeanChanged"
   ></EditComponent>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import {createSaveData} from './save-bean.service'
import EditComponent from './components/EditComponent.vue';

/** @type {{schema: string, table: string, id: string}} */ //@ts-ignore
const props = defineProps(['schema', 'table', 'id'])
const {bean, cols, init, save, isBeanChanged} = createSaveData(props, 'update')

onMounted(() => init().then(() => isBeanChanged.value = false))
watch(() => [props.table, props.schema, props.id], init)
</script>
