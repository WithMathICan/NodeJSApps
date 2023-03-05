<template>
<div>
   <Card>
      <template #title>Аттрибуты</template>
      <template #content>
         <div class="grid2 mb-2" v-for="attr in usedAttributes">
            <div>{{ attr.title }}</div>
            <div class="p-inputgroup">
               <InputNumber v-if="attr.attribute_type === 'integer'" v-model.number="modelValue[attr.title]" />
               <InputNumber v-else-if="attr.attribute_type === 'float'" v-model.number="modelValue[attr.title]" :minFractionDigits="0" :maxFractionDigits="20" />
               <InputText v-else="attr.attribute_type === 'text'" v-model="modelValue[attr.title]" />
               <Button icon="pi pi-times" class="p-button-danger" @click="removeAttribute(attr.title)"/>
            </div>
         </div>
         <div class="grid2">
            <Button icon="pi pi-plus" class="p-button-rounded p-button-success m-2" label="Добавить аттрибут" @click="addAttribute"></Button>
            <Dropdown class="w-full" v-model="selectedAttribute" :options="unusedAttributes" optionLabel="title" 
               :filter="(unusedAttributes.length>8)" placeholder="Выбрать аттрибут" />
         </div>
      </template>
   </Card>
</div>
</template>

<script setup>
import { FillBeans, spBeans, spTableKey } from '../../store';
import { onMounted, ref, computed } from 'vue'
import { showMessage } from '../../messages';

const props = defineProps(['key_schema', 'key_table', 'modelValue'])
const emit = defineEmits(['update:modelValue'])
const selectedAttribute = ref()
const tableKey = computed(() => spTableKey(props.key_schema, props.key_table))
const usedKeys = computed(() => Object.keys(props.modelValue ?? {}))
const allAttributes = computed(() => spBeans[tableKey.value] ?? [])
const usedAttributes = computed(() => allAttributes.value.filter(el => usedKeys.value.includes(el.title)))
const unusedAttributes = computed(() => allAttributes.value.filter(el => !usedKeys.value.includes(el.title)))
onMounted(() => {
   FillBeans(props.key_schema, props.key_table)
   if (!props.modelValue) emit('update:modelValue', {})
})
function addAttribute(){
   if (usedKeys.value.includes(selectedAttribute.value.title)){
      showMessage('Данный аттрибут уже использован', 10000, 'error')
      return
   }
   props.modelValue[selectedAttribute.value.title] = selectedAttribute.value.attribute_type === 'text' ? '' : 0
   emit('update:modelValue', props.modelValue)
}
function removeAttribute(name){
   delete props.modelValue[name]
}
</script>

<style scoped>
.grid2 {
   display: grid;
   grid-template-columns: 1fr 1fr;
   align-items: center;
}
</style>
