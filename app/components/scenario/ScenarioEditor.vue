<script setup lang="ts">
/* these are necessary styles for vue flow */
import '@vue-flow/core/dist/style.css';
/* this contains the default theme, these are optional styles */
import '@vue-flow/core/dist/theme-default.css';
import { VueFlow, useVueFlow, useNode } from "@vue-flow/core";
const { onConnect, addEdges, findNode } = useVueFlow()

const nodes = ref([
  {
    id: '1',
    type: 'input',
    position: { x: 50, y: 50 },
    data: { label: 'Node 1', },
  }
]);

function addNode() {
  const id = Date.now().toString()

  nodes.value.push({
    id,
    position: { x: 150, y: 50 },
    data: { label: `Node ${id}`, },
  })
}

function handleDrop(event) {
  // Create node from dragged data
  const nodeType = event.dataTransfer.getData('node')
  const newNode = {
    type: nodeType,

  }

  addNode(newNode)
}

function handleOnDragOver(event) {
  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}


onConnect((params) => {
  addEdges(params)
})

const node = useNode();
/*watchEffect(() => {
  if (node.connectedEdges && node.connectedEdges.value.length > 0) {
    const filteredEdges = node.connectedEdges.value.filter(
        (item) => item.target === node.id
    );
    referenceOptions.value = filteredEdges.map((edge) => {
      const node = findNode(edge.source);
      const currentItem: Option = {
        groupName: node?.data.title ?? node?.label,
        options: [],
      };

      if (node?.data.output) {
        node?.data.output
            .filter((item: any) => Boolean(item.name))
            .forEach((option: any) => {
              currentItem.options.push({
                label: option.name,
                value: option.name,
              });
            });
      } else {
        currentItem.options = [];
      }
      return currentItem;
    });
  }
});*/
</script>

<template>
  <Draggable/>

  <div
      @drop="handleDrop"
      @dragover="handleOnDragOver"
      class="h-[800px] w-full"
  >

    <VueFlow :nodes="nodes">
      VueFlow
    </VueFlow>

  </div>
</template>

<style scoped>

</style>
