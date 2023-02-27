import ViewAllRecords from './view-all/ViewAllRecords.vue'
import UpdateRecord from './edit/UpdateRecord.vue'
import CopyRecord from './edit/CopyRecord.vue'
import InsertRecord from './edit/InsertRecord.vue'
import Main from './Main.vue'
import NotFound from './NotFound.vue'

/** @param {Record<string, string[]>} tables */
export function CreateRoutes(tables) {
   /**@type {import('vue-router').RouteRecordRaw[]} */
   let routes = []
   for (let schema in tables) {
      for (let table of tables[schema]) {
         routes.push({
            name: `view_all_${schema}_${table}`,
            path: `/${schema}/${table}`,
            component: <ViewAllRecords table={table} schema={schema} />
         })
      }
   }
   routes.push({
      path: `/:schema/:table/edit/:id`,
      name: 'edit',
      component: UpdateRecord,
      props: true,
   })
   routes.push({
      path: `/:schema/:table/copy/:id`,
      name: 'copy',
      component: CopyRecord,
      props: true,
   })
   routes.push({
      path: `/:schema/:table/new`,
      name: 'new',
      component: InsertRecord,
      props: true,
   })
   routes.push({
      path: `/`,
      name: 'main',
      component: Main,
   })
   routes.push({
      path: '/:catchAll(.*)*',
      component: NotFound,
   })
   // console.log({routes});
   return routes
}