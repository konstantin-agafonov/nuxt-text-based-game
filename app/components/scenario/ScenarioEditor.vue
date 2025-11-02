<script setup lang="ts">
/* these are necessary styles for vue flow */
import '@vue-flow/core/dist/style.css';
/* this contains the default theme, these are optional styles */
import '@vue-flow/core/dist/theme-default.css';

import { VueFlow, useVueFlow, useNode } from "@vue-flow/core";

import type { Dimensions, Elements } from '@vue-flow/core'
const elements = ref<Elements>()

import FieldNode from '@/components/scenario/nodes/FieldNode.vue'

const nodeTypes = {
  field: markRaw(FieldNode),
}

const { findNode, nodes, addNodes, addEdges, project, vueFlowRef, onConnect, setNodes, setEdges, setViewport } =
    useVueFlow({
      nodes: [
        {
          id: '1',
          type: 'field',
          position: { x: 25, y: 25 },
          data: { label: 'FieldNode 1', },
        },
        {
          id: '2',
          type: 'input',
          position: { x: 100, y: 150 },
          data: { label: 'Node 1', },
        }
      ]
    })



function handleDrop(event) {
  // Create node from dragged data
  const nodeType = event.dataTransfer.getData('node')
  const newNode = {
    id: new Date(),
    type: nodeType,
    position: { x: 10, y: 15 },
  }

  addNodes([newNode])
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

/*const node = useNode();*/

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
  <div class="flex items-center">
    <DraggableField/>
  </div>

  <div
      @drop="handleDrop"
      @dragover="handleOnDragOver"
      class="h-[800px] w-full"
  >
    <VueFlow
        :node-types="nodeTypes"
        v-model="elements"
        fit-view
    ></VueFlow>
  </div>
</template>

<style scoped>

</style>
