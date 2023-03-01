import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { spColsData } from '../store';

/**
* @param {import('types').Col} col1
* @param {import('types').Col} col2
*/
export function sortCols(col1, col2) {
   if (col1.column_name < col2.column_name) return -1
   if (col1.column_name > col2.column_name) return 1
   return 0
}

export function createFilters(key, filters) {
   const cols = spColsData[key]
   if (!cols) return
   /** @type {import('primevue/datatable').DataTableFilterMeta} */
   const filter = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      id: {
         operator: FilterOperator.AND,
         constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      }
   }
   if (!cols) return filter
   for (const col of cols) {
      if (col.fk) {
         filter[col.column_name] = { value: null, matchMode: FilterMatchMode.IN }
      } else {
         const matchMode = col.data_type === 'date' ?
            FilterMatchMode.DATE_IS :
            col.data_type === 'number' ?
               FilterMatchMode.EQUALS :
               FilterMatchMode.CONTAINS
         filter[col.column_name] = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode }],
         }
      }
   }
   filters.value = filter
}

/** @param {import('types').Col[]} cols*/
export  function setInitialCols(cols, selectedColumns, localStorageKey) {
   const fields = localStorage.getItem(localStorageKey.value)
   if (fields) {
      const arrFields = fields.split(',')
      selectedColumns.value = cols.filter(col => arrFields.includes(col.column_name))
   } else {
      selectedColumns.value = cols
   }
}

/** @param {import('types').Col} col */
export  function findDataType(col) {
   if (col.data_type === 'date') return 'date'
   else if (col.data_type === 'number') return 'numeric'
   return 'text'
}
