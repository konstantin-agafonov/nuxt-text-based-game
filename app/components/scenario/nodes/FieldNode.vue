<script lang="ts" setup>
import { Handle, Position, useNode } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'

const props = defineProps<NodeProps>()

const node = useNode()

function handleClickAddBtn() {
  data.value.push({
    name: '',
    description: '',
    type: '',
    isRequired: true
  })
  node.node.data = {
    ...node.node.data,
    output: data
  }
}

function handleClickDeleteBtn(index: number) {
  data.value.splice(index, 1)
  node.node.data = {
    ...node.node.data,
    output: data
  }
}
</script>

<template>
  <div class="max-w-[520px] rounded-sm border border-gray-200 bg-white p-3 shadow-md">
    <div class="flex flex-col gap-y-4">
      <div class="flex justify-between">
        <div class="flex items-center gap-x-2">
          <div class="flex flex-col gap-y-1">
            <p class="text-sm text-gray-500">Start</p>
          </div>
        </div>
      </div>

      <span class="text-sm text-gray-500"
      >The starting node of the workflow, used to set the information needed to initiate the workflow.</span
      >

      <div class="flex justify-between">
        <p class="flex items-center gap-x-1">
          Input
        </p>
        <plus-icon class="h-6 w-5 cursor-pointer text-primary" @click="handleClickAddBtn" />
      </div>

      <div class="grid gap-y-3">
      </div>
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
