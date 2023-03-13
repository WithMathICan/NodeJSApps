<template>
   <Tree v-model:selectionKeys="selectionKeys" :value="nodes" selectionMode="checkbox" class="w-full" :filter="true"
      optionLabel="___m2m_title" optionValue="id" @node-select="onNodeSelect" @node-unselect="onNodeSelect" />
</template>

<script setup>
import Tree from 'primevue/tree'
import { FillBeans } from '../../store';
import { onMounted, ref } from 'vue'

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col'])

/** @type {import('vue').Ref<import('primevue/tree').TreeSelectionKeys>} */
const selectionKeys = ref([])
/** @type {Record<string, import('primevue/tree').TreeNode>} */
const treeLeafs = {}
/** @type {import('primevue/tree').TreeNode[]} */
let nodes = []

function init() {
   FillBeans(props.col.table_schema, props.col.m2m.table).then(beans => {
      const lastIndex = props.col.m2m.title_column[props.col.m2m.title_column.length - 1]
      findTreeLeafs(lastIndex, beans)
      nodes = findTree()
      selectionKeys.value = findSelectedNodes(nodes)
   })
}

onMounted(init)



function onNodeSelect() {
   // console.log(node);
   const arr = []
   for (let key in selectionKeys.value){
      if (key in treeLeafs) arr.push(key)
   }
   props.bean[props.col.column_name] = arr
}

/**
 * @param {string} key 
 * @param {import('types').DbRecord[]} beans 
 */
 function findTreeLeafs(key, beans) {
   for (let key in treeLeafs) delete treeLeafs[key]
   for (let item of beans) {
      treeLeafs[item.id] = {
         key: item.id,
         data: item,
         label: item[key],
         leaf: true,
      }
   }
}

function findTree() {
   /** @type {import('primevue/tree').TreeNode[]} */
   const treeNodes = []
   const { title_column } = props.col.m2m
   if (!Array.isArray(title_column)) return treeNodes
   if (title_column.length < 2) return Object.values(treeLeafs)
   treeNodes.push({ key: '', label: 'initial___node', data: Object.values(treeLeafs) })
   filterLeafs(treeNodes[0], 0)
   return treeNodes[0].children ?? []
}


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
</script>