<template>
   <label :for="col.column_name">{{col.column_name}}<span class="text-red-500" v-if="!col.is_nullable">*</span></label>
   <MultiSelect class="w-full" v-model="bean[col.column_name]" :required="!col.is_nullable"
      :options="showOptions" :optionLabel="col.m2m.title_column" 
      :optionValue="'id'" :filter="(showOptions.length>8)" />
</template>

<script setup>
import { FillBeans, spTableKey, spBeans } from '../../store.js';
import {computed} from 'vue'
import MultiSelect from 'primevue/multiselect';

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col']) 
FillBeans(props.col.table_schema, props.col.m2m.table)
let key = spTableKey(props.col.table_schema, props.col.m2m.table)
let showOptions = computed(() => {
   if (Array.isArray(spBeans[key])) return spBeans[key].sort((a, b) => {
      if (a[props.col.m2m.title_column] > b[props.col.m2m.title_column]) return 1
      return -1
   })
   return []
})
</script>
