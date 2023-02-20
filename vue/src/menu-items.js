import { ref } from 'vue'

/** @type {import('vue').Ref<import('primevue/menuitem').MenuItem[]>} */
export const menuItems = ref([])

/** @param {Record<string, string[]>} tables */
export function CreateMenuItems(tables) {
   menuItems.value = Object.keys(tables).map(schema => ({
      label: schema,
      items: tables[schema].map(table => ({ label: table, to: `/${schema}/${table}` }))
   }))
}
