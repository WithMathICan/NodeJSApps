import { reactive, ref } from 'vue'
import { api } from './api.js'
import { showMessage } from './messages.js'

export const spTableKey = (schema, table) => `${schema}.${table}`

/** @type {{[x:string]: import('types').Col[]}} */
export const spColsData = reactive({})
/** @type {{[x:string]: boolean}} */
export const spColsDataLoading = reactive({})

/** @type {{[x:string]: import('types').DbRecord[] }} */
export const spBeans = reactive({})
/** @type {{[x:string]: boolean}} */
export const spBeansLoading = reactive({})

export const loading = ref(false)


/**
 * @param {string} schema
 * @param {string} table
 * @param {boolean} refresh
 * @returns {Promise<import('types').Col[]>}
 */
export const FillColsData = (schema, table, refresh = false) => new Promise(resolve => {
   getData(spTableKey(schema, table), refresh, spColsData, spColsDataLoading, api[schema][table].GetCols, resolve)
})

/**
 * @param {string} schema
 * @param {string} table
 * @param {boolean} refresh
 * @returns {Promise<import('types').DbRecord[]>}
 */
export const FillBeans = (schema, table, refresh = false) => new Promise(resolve => {
   getData(spTableKey(schema, table), refresh, spBeans, spBeansLoading, api[schema][table].GetBeans, resolve)
})

/**
 * @param {string} schema
 * @param {string} table
 * @param {import('types').DbRecord | null} bean
 * @returns
 */
export function UpdateBeans(schema, table, bean) {
   const key = spTableKey(schema, table)
   if (!bean || !bean.id || !Array.isArray(spBeans[key])) return
   const oldBean = spBeans[key].find(el => el.id === bean.id)
   if (oldBean) {
      for (const bkey in oldBean) if (bkey in bean) oldBean[bkey] = bean[bkey]
   } else {
      spBeans[key] = [bean, ...spBeans[key]]
   }
}

/**
 * @param {string} schema
 * @param {string} table
 * @param {string[]} ids
 * @param {Function} callback
 */
export function RemoveBeans(schema, table, ids, callback = () => { }) {
   const key = spTableKey(schema, table)
   api[schema][table].RemoveBeans(ids).then(deletedIds => {
      if (!Array.isArray(deletedIds)) return showMessage('Ошибка при удалении', 5000, 'error')
      if (Array.isArray(spBeans[key])) spBeans[key] = spBeans[key].filter(el => !deletedIds.includes(el.id))
      callback(deletedIds)
   })
}

function getData(key, refresh, reactiveData, reactiveDataLoading, method, cb) {
   if (reactiveDataLoading[key]) {
      let i = 0;
      const intervalId = setInterval(() => {
         i++;
         if (!reactiveDataLoading[key] || i > 100) {
            clearInterval(intervalId)
            if (Array.isArray(reactiveData[key])) cb(reactiveData[key])
            else cb([])
         }
      }, 200)
   } else if (Array.isArray(reactiveData[key]) && !refresh) {
      cb(reactiveData[key])
   } else {
      reactiveDataLoading[key] = true
      method().then(data => {
         reactiveDataLoading[key] = false
         reactiveData[key] = data
         cb(data)
      })
   }
}


// /**
//  * @param {string} schema
//  * @param {string} table
//  * @param {*} spCols
//  * @param {*} getMethod
//  * @param {boolean} refresh
//  * @returns {Promise<import('types').Col[]>}
//  */
// async function FillCols(schema, table, spCols, getMethod, refresh) {
//    const key = spTableKey(schema, table)
//    if (spCols[key] && !refresh) return spCols[key];
//    if (spCols[key] === 'loading') return [];
//    spCols[key] = 'loading'
//    spCols[key] = await getMethod()
//    return spCols[key]
// }

// const key = spTableKey(schema, table)
// if (spBeansLoading[key]) {
//    let i = 0;
//    const intervalId = setInterval(() => {
//       i++;
//       if (!spBeansLoading[key] || i > 100) {
//          clearInterval(intervalId)
//          if (Array.isArray(spBeans[key])) resolve(spBeans[key])
//          else resolve([])
//       }
//    }, 200)
// } else if (Array.isArray(spBeans[key]) && !refresh) {
//    resolve(spBeans[key])
// } else {
//    spBeansLoading[key] = true
//    api[schema][table].GetBeans().then(data => {
//       spBeansLoading[key] = false
//       spBeans[key] = data
//       resolve(data)
//    })
// }
