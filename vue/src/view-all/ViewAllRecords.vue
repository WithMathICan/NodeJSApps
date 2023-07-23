<template>
   <span v-if="filters">{{ filters['global'].value }}</span>
   <h1 class="text-700 mb-2">{{ table }} </h1>
   <Dropdown v-if="treeFields.length > 0" v-model="tableType" option-label="value" option-value="value"
      :options="[{ value: 'simple' }].concat(treeFields.map(value => ({ value })))" />
   <div v-if="tableKey && Array.isArray(spBeans[tableKey])">
      <div class="mt-2 mb-2 flex justify-content-between align-items-center">
         <div>
            <router-link class="link p-button p-button-warning"
               :to="{ name: 'new', params: { schema, table } }">Создать</router-link>
            <ButtonDelete :schema="schema" :table="table" :ids="ids" label="Удалить" :delete-cb="clearSelected" />
         </div>
         <span class="p-input-icon-left" v-if="filters">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
         </span>
      </div>
      <DataTable v-if="tableType === 'simple'" responsiveLayout="scroll" :value="spBeans[tableKey]" dataKey="id" :rowHover="true"
         v-model:filters="filters" filterDisplay="menu" v-model:selection="selectedBeans" :rows="10" :paginator="true"
         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
         :rowsPerPageOptions="[2, 5, 10, 25, 50, 100, 500]"
         currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" stateStorage="session"
         :stateKey="`dt-state-session-${schema}-${table}`" :globalFilterFields="['title']">
         <template #header>
            <div class="flex justify-content-between align-items-center mb-2">
               <Button type="button" icon="pi pi-filter-slash" class="p-button-outlined" @click="filters=createFilters(tableKey)" />
               <span v-if="selectedBeans.length" class="text-blue-600">{{ selectedBeans.length }} выбрано</span>
            </div>
            <div style="text-align:left" v-if="Array.isArray(spColsData[tableKey])">
               <MultiSelect :modelValue="selectedColumns" :options="[...spColsData[tableKey]].sort(sortCols)"
                  optionLabel="column_name" placeholder="Select Columns" style="width: 100%" display="chip"
                  @update:modelValue="onToggle" />
            </div>
         </template>
         <template #empty>
            <h3 class="text-pink-500">Записей нет</h3>
         </template>
         <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
         <Column field="id" header="ID" :sortable="true">
            <template #body="slotProps">
               <router-link class="link p-button p-button-info" :to="linkToEdit(slotProps.data)">
                  {{ slotProps.data.id }}
               </router-link>
            </template>
            <template #filter="{ filterModel }">
               <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by ID" />
            </template>
         </Column>
         <Column v-for="col of columnsInTable" :field="col.column_name" :header="col.column_name" :sortable="true"
            :data-type="findDataType(col)" :showFilterMatchModes="!col.fk">
            <template #body="slotProps">
               <ColFk v-if="col.data_type === 'fk'" :col="col" :bean="slotProps.data" />
               <ColDate v-else-if="col.data_type === 'date'" :bean="slotProps.data" :col="col" />
               <ColNumber v-else-if="col.data_type === 'number'" :bean="slotProps.data" :col="col" />
               <ColString v-else-if="col.data_type === 'varchar'"
                  :data="slotProps.data[col.column_name]?.substring(0, 150)" />
               <ColM2M v-else-if="col.data_type === 'm2m'" :col="col" :bean="slotProps.data"></ColM2M>
               <Image v-else-if="col.data_type === 'file'" 
                  :src="slotProps.data[col.column_name]" :alt="slotProps.data[col.column_name]" width="250" preview ></Image>
            </template>
            <template #filter="{ filterModel }">
               <Calendar v-if="col.data_type === 'date'" v-model="filterModel.value" dateFormat="dd-mm-yy"
                  placeholder="dd-mm-yyyy" />
               <MultiSelect
                  v-else-if="col.fk && Array.isArray(spBeans[spTableKey(col.fk.foreign_table_schema, col.fk.foreign_table_name)])"
                  v-model="filterModel.value"
                  :filter="spBeans[spTableKey(col.fk.foreign_table_schema, col.fk.foreign_table_name)].length > 5"
                  :options="spBeans[spTableKey(col.fk.foreign_table_schema, col.fk.foreign_table_name)]"
                  :optionLabel="col.fk.foreign_title_column_name" :option-value="col.fk.foreign_column_name"
                  placeholder="Any" class="p-column-filter">
               </MultiSelect>
               <InputNumber v-else-if="col.data_type === 'number'" v-model="filterModel.value" mode="decimal"
                  :min-fraction-digits="0" :max-fraction-digits="5" />
               <InputText v-else type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search" />
            </template>
         </Column>
         <Column header="Actions">
            <template #body="slotProps">
               <ButtonDelete :schema="schema" :table="table" :ids="[slotProps.data.id]" label=""
                  :delete-cb="clearSelected" />
               <ButtonModalEdit :schema="schema" :table="table" :id="slotProps.data.id" />
               <router-link class="link p-button p-button-secondary p-button-icon-only p-component"
                  :to="{ name: 'copy', params: { schema, table, id: slotProps.data.id } }">
                  <span class="pi pi-copy p-button-icon"></span>
               </router-link>
            </template>
         </Column>
      </DataTable>
      <TreeTable v-else responsiveLayout="scroll" :value="treeView">
         <template #empty>
            <h3 class="text-pink-500">Записей нет</h3>
         </template>
         <Column field="id" header="ID" :sortable="true" :expander="true">
            <template #body="slotProps">
               <router-link class="link p-button p-button-info" :to="linkToEdit(slotProps.node.data)">
                  {{ slotProps.node.data.id }}
               </router-link>
            </template>
         </Column>
         <Column field="title" header="Title"></Column>
         <!-- <Column field="name" header="Name" :expander="true"></Column> -->

         <Column header="Actions">
            <template #body="slotProps">
               <ButtonDelete :schema="schema" :table="table" :ids="[slotProps.node.data.id]" label=""
                  :delete-cb="clearSelected" />
               <ButtonModalEdit :schema="schema" :table="table" :id="slotProps.node.data.id" />
               <router-link class="link p-button p-button-secondary p-button-icon-only p-component"
                  :to="{ name: 'copy', params: { schema, table, id: slotProps.node.data.id } }">
                  <span class="pi pi-copy p-button-icon"></span>
               </router-link>
            </template>
         </Column>
      </TreeTable>
   </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import { FillBeans, FillColsData, spTableKey, spBeans, spColsData } from '../store';
import { createFilters, findDataType, setInitialCols, sortCols } from './view-all-records-functions'

import ColString from './cols/ColString.vue'
import ColFk from './cols/ColFk.vue'
import ColDate from './cols/ColDate.vue'
import ColNumber from './cols/ColNumber.vue'
import ButtonDelete from '../edit/components/ButtonDelete.vue';
import ButtonModalEdit from '../edit/components/ButtonModalEdit.vue';
import ColM2M from './cols/ColM2M.vue';
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import TreeTable from 'primevue/treetable'

const props = defineProps({
   schema: { type: String, required: true },
   table: { type: String, required: true },
})

let tableKey = computed(() => spTableKey(props.schema, props.table))
const filters = ref()
/** @type {import('vue').Ref<import('types').DbRecord[]>} */
let selectedBeans = ref([])
let ids = computed(() => selectedBeans.value.map(el => el.id))
/** @type {import('vue').Ref<import('types').Col[]>} */
let selectedColumns = ref([])
let localStorageKey = computed(() => `key-view-all-${props.schema}-${props.table}`)
let columnsInTable = computed(() => {
   if (Array.isArray(spColsData[tableKey.value])) return spColsData[tableKey.value].filter(el => {
      if (selectedColumns.value.find(c => c.column_name === el.column_name)) return true
      return false
   })
   return []
})

/** @param {string[]} deletedIds */
function clearSelected(deletedIds) {
   selectedBeans.value = selectedBeans.value.filter(el => !deletedIds.includes(el.id))
}

/** @param {import('primevue/multiselect').MultiSelectAllChangeEvent} val*/
function onToggle(val) {
   if (!Array.isArray(val)) return
   localStorage.setItem(localStorageKey.value, val.map(col => col.column_name).join(','))
   if (Array.isArray(spColsData[tableKey.value])) {
      selectedColumns.value = spColsData[tableKey.value].filter(col => val.includes(col));
   }
};

const tableType = ref('simple')
const treeFields = computed(() => {
   const cols = spColsData[tableKey.value]
   const arr = []
   if (!Array.isArray(cols)) return arr
   for (let col of cols) if (col.fk) {
      if (col.fk.foreign_table_schema === props.schema && col.fk.foreign_table_name === props.table) arr.push(col.column_name)
   }
   return arr
})
const treeView = computed(() => {
   const field = tableType.value
   // if (field === 'simple') return []
   const resBeans = []
   const beansObject = {}
   const beans = spBeans[tableKey.value]
   if (!Array.isArray(beans)) return []
   if (beans.length === 0) return []
   for (const bean of beans) beansObject[bean.id] = { key: bean.id, data: bean }
   for (const id in beansObject) {
      if (beansObject[id].data.parent_id) {
         if (!beansObject[beansObject[id].data.parent_id].children) beansObject[beansObject[id].data.parent_id].children = []
         beansObject[beansObject[id].data.parent_id].children.push(beansObject[id])
      } else {
         resBeans.push(beansObject[id])
      }
   }
   return resBeans
})

function init() {
   tableType.value = 'simple'
   FillBeans(props.schema, props.table)
   FillColsData(props.schema, props.table).then(cols => {
      setInitialCols(cols, selectedColumns, localStorageKey)
      filters.value = createFilters(tableKey.value)
   })
}

onMounted(init)
watch(() => [props.schema, props.table], init)

/** @param {import('types').DbRecord} bean */
function linkToEdit(bean) {
   return { name: 'edit', params: { schema: props.schema, table: props.table, id: bean.id } }
}

</script>

<style lang="scss">
.link {
   text-decoration: none;
   font-weight: 900;
   display: inline-block;
}
</style>