<script setup lang="ts">
/* these are necessary styles for vue flow */
import '@vue-flow/core/dist/style.css';
/* this contains the default theme, these are optional styles */
import '@vue-flow/core/dist/theme-default.css';

import { VueFlow, useVueFlow, useNode } from "@vue-flow/core";

import type { Dimensions } from '@vue-flow/core'

const scenarioStore = useScenarioStore()
const { scenario } = storeToRefs(scenarioStore)

import FieldNode from '@/components/scenario/nodes/FieldNode.vue'
import {useScenarioStore} from "~/stores/scenario";

const nodeTypes = {
  field: markRaw(FieldNode),
}

const { findNode, nodes, edges, addNodes, addEdges, project,
  vueFlowRef, onConnect, setNodes, setEdges, setViewport } = useVueFlow()


function handleDrop(event) {
  // Create node from dragged data
  const type = event.dataTransfer.getData('node')
  const { left, top } = vueFlowRef.value!.getBoundingClientRect()

  const position = project({
    x: event.clientX - left,
    y: event.clientY - top
  })

  const newNode = {
    id: (nodes.value.length + 1).toString(),
    type,
    position,
    data: {
      test: 'test'
    }
  }

  addNodes(newNode)

  nextTick(() => {
    const node = findNode(newNode.id)
    const stop = watch(
        () => node!.dimensions,
        (dimensions: Dimensions) => {
          if (dimensions.width > 0 && dimensions.height > 0 && node) {
            node.position = {
              x: node.position.x - node.dimensions.width / 2,
              y: node.position.y - node.dimensions.height / 2
            }
            stop()
          }
        },
        { deep: true, flush: 'post' }
    )
  })
}

function handleOnDragOver(event) {
  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}


onConnect((params) => {
  const { source, sourceHandle, target, targetHandle } = params

  // Prevent multiple edges from the same handle
  const existing = edges.value.find(
      (e) =>
          (e.source === source && e.sourceHandle === sourceHandle) ||
          (e.target === target && e.targetHandle === targetHandle)
  )

  if (existing) {
    console.warn('⚠️ Handle already connected, skipping duplicate.')
    return false // Vue Flow will cancel the connection
  }

  addEdges(params)
})

function onNodeClick({ event, node }) {
  /*console.log('Node clicked:', node, event);*/
}

</script>

<template>
  <div class="flex items-center p-1">
    <DraggableField/>
  </div>

  <div
      @drop="handleDrop"
      @dragover="handleOnDragOver"
      class="h-[800px] w-full"
  >
    <VueFlow
        :node-types="nodeTypes"
        v-model="scenario"
        fit-view
        @node-click="onNodeClick"
    ></VueFlow>
  </div>
</template>

<style scoped>

</style>
