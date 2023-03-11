<template>
<div>
   <label :for="col.column_name">{{col.column_name}}<span class="text-red-500" v-if="!col.is_nullable">*</span></label>
   <InputText v-if="col.data_type === 'varchar'" class="w-full" :required="!col.is_nullable" :id="col.column_name" 
      type="text" v-model="bean[col.column_name]"/>
   <InputNumber v-else-if="col.data_type === 'number'" class="w-full" :required="!col.is_nullable" 
      :id="col.column_name" v-model.number="bean[col.column_name]" />
   <Calendar v-else-if="col.data_type === 'date'" class="w-full" :required="!col.is_nullable" 
      v-model="bean[col.column_name]" :showTime="true" />
   <InputFk v-else-if="col.data_type === 'fk'" :bean="bean" :col="col"></InputFk>
   <InputM2MTree v-else-if="col.data_type === 'm2m' && col.m2m.isTree" :bean="bean" :col="col"></InputM2MTree>
   <InputM2M v-else-if="col.data_type === 'm2m'" :bean="bean" :col="col"></InputM2M>
   <InputFile v-else-if="col.data_type === 'file'" v-model="bean[col.column_name]"  
      :schema="col.table_schema" :table="col.table_name" :field_name="col.column_name" ></InputFile>
   <InputKeyValue v-else-if="col.data_type  === 'key-value'" :key_schema="col.keyValue.keys_schema_name" 
      :key_table="col.keyValue.keys_table_name" v-model="bean[col.column_name]"/>
</div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar';
import InputFk from './InputFk.vue'
import InputM2M from './InputM2M.vue';
import InputFile from './InputFile.vue';
import InputKeyValue from './InputKeyValue.vue';
import InputM2MTree from './InputM2MTree.vue';

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col']) 

if (props.col.data_type === 'date' && props.bean[props.col.column_name]) {
   let date = Date.parse(props.bean[props.col.column_name])
   props.bean[props.col.column_name] = date ? new Date(date) : new Date()
}
</script>