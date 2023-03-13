<template>
   <Tree v-model:selectionKeys="selectionKeys" :value="nodes" selectionMode="checkbox" class="w-full" :filter="true"
      optionLabel="___m2m_title" optionValue="id" @node-select="onNodeSelect" @node-unselect="onNodeSelect" />
</template>

<script setup>
import Tree from 'primevue/tree'
import { FillBeans, spBeans, spTableKey } from '../../store';
import { computed, ref, onMounted } from 'vue'

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col'])

/** @type {import('vue').Ref<import('primevue/tree').TreeSelectionKeys>} */
const selectionKeys = ref([])

const beans = computed(() => spBeans[spTableKey(props.col.table_schema, props.col.m2m.table)] ?? [])
const leafs = computed(() => {
   const key = props.col.m2m.title_column[props.col.m2m.title_column.length - 1]
   /** @type {Record<string, import('primevue/tree').TreeNode>} */
   const treeLeafs = {}
   for (let item of beans.value) {
      treeLeafs[item.id] = {
         key: item.id,
         data: item,
         label: item[key],
         leaf: true,
      }
   }
   return treeLeafs
})

const nodes = computed(() => {
   /** @type {import('primevue/tree').TreeNode[]} */
   const treeNodes = []
   const { title_column } = props.col.m2m
   if (!Array.isArray(title_column)) return treeNodes
   if (title_column.length < 2) return Object.values(leafs.value)
   treeNodes.push({ key: '', label: 'initial___node', data: Object.values(leafs.value) })
   filterLeafs(treeNodes[0], 0)
   return treeNodes[0].children ?? []
})

onMounted(() => {
   FillBeans(props.col.table_schema, props.col.m2m.table).then(() => {
      selectionKeys.value = findSelectedNodes(nodes.value)
   })
})

/**
 * @param {import('primevue/tree').TreeNode} parentNode 
 * @param {number} idx
 */
function filterLeafs(parentNode, idx) {
   const fieldsArr = props.col.m2m.title_column
   parentNode.children = []
   const fieldName = fieldsArr[idx]
   const isLastLevel = idx === fieldsArr.length - 2
   for (let leaf of parentNode.data) {
      const nodeKey = `${parentNode.key}__${leaf.data[fieldName]}`
      let node = parentNode.children.find(el => el.key === nodeKey)
      if (isLastLevel) {
         if (node && node.children) node.children.push(leaf)
         else parentNode.children.push({ key: nodeKey, label: leaf.data[fieldName], children: [leaf] })
      } else {
         if (node) node.data.push(leaf)
         else parentNode.children.push({ key: nodeKey, label: leaf.data[fieldName], data: [leaf] })
      }
   }
   delete parentNode.data
   if (!isLastLevel) for (const node of parentNode.children) filterLeafs(node, idx + 1)
}

/** @param {import('primevue/tree').TreeNode[] } treeNodes */
const findSelectedNodes = (treeNodes) => {
   const selectedIds = props.bean[props.col.column_name]
   /** @type {import('primevue/tree').TreeSelectionKeys} */
   const keys = {}
   for (const treeNode of treeNodes) {
      if (treeNode.leaf) {
         if (selectedIds.includes(treeNode.key)) keys[treeNode.key ?? 'key'] = { checked: true, partialChecked: false }
      }
      else {
         let newKeys = findSelectedNodes(treeNode.children ?? [])
         let checkedCount = 0
         for (let ii in newKeys) {
            if (newKeys[ii].checked) {
               // console.log(ii);
               for (let ch of treeNode.children ?? []) {
                  // console.log({choldren__key: ch.key});
                  if (ch.key == ii) checkedCount += 1
               }
            }
            keys[ii] = newKeys[ii]
         }
         if (checkedCount > 0){
            // console.log(newKeys);
            // console.log(checkedCount, Object.keys(newKeys).length);
            if (!treeNode.key) return keys
            if (checkedCount === treeNode.children?.length) keys[treeNode.key] = { checked: true, partialChecked: false }
            else  keys[treeNode.key] = { checked: false, partialChecked: true }
         }
      }
   }
   return keys
}

function onNodeSelect() {
   // console.log(node);
   const arr = []
   for (let key in selectionKeys.value){
      if (key in leafs.value) arr.push(key)
   }
   props.bean[props.col.column_name] = arr
}

</script>