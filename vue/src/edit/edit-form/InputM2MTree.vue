<template>
   <pre>{{ selectionKeys }}</pre>
<Tree v-model:selectionKeys="selectionKeys" :value="nodes" selectionMode="checkbox" class="w-full" :filter="true"
   optionLabel="___m2m_title" optionValue="id" @node-select="onNodeSelect" @node-unselect="onNodeUnselect"/>
</template>

<script setup>
import Tree from 'primevue/tree'
import { FillBeans, spBeans, spTableKey } from '../../store';
import { computed, ref } from 'vue'

/** @type {{bean: any, col: import('types').Col}} */ // @ts-ignore
let props = defineProps(['bean', 'col']) 

/** @type {import('vue').Ref<import('primevue/tree').TreeSelectionKeys>} */
const selectionKeys = ref([])
FillBeans(props.col.table_schema, props.col.m2m.table)

const nodes = computed(() => {
   /** @type {import('primevue/tree').TreeNode[]} */
   const treeNodes = []  
   const {title_column} = props.col.m2m
   if (!Array.isArray(title_column)) return treeNodes
   const leafs = createLeafs()
   if (title_column.length < 2) return leafs
   treeNodes.push({key: 'initial___node', label: 'initial___node', data: leafs})
   filterLeafs(treeNodes[0], 0)
   return treeNodes[0].children
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
         else parentNode.children.push({key: nodeKey, label: leaf.data[fieldName], children: [leaf]})
      } else {
         if (node) node.data.push(leaf)
         else parentNode.children.push({key: nodeKey, label: leaf.data[fieldName], data: [leaf]})
      }
   }
   if (!isLastLevel) for (const node of parentNode.children) filterLeafs(node, idx+1)
}

function createLeafs(){
   const key = props.col.m2m.title_column[props.col.m2m.title_column.length - 1]
   const treeLeafs = []
   for (let item of spBeans[spTableKey(props.col.table_schema, props.col.m2m.table)] ?? []) {
      treeLeafs.push({
         key: item.id,
         data: item,
         label: item[key],
      })
   }
   return treeLeafs
}

function onNodeSelect(node) {
   console.log(node);
}

function onNodeUnselect(node) {
   console.log(node);
}

</script>