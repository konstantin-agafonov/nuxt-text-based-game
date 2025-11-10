<script lang="ts" setup>
import { Handle, Position, useNode, useVueFlow } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'

const scenarioStore = useScenarioStore()
const { nodeBeingEdited } = storeToRefs(scenarioStore)

const props = defineProps<NodeProps>()
const node = useNode()
const { removeNodes, nodes, addNodes } = useVueFlow()

const scene = ref('Enter scene here')
const editing = ref(false)

function handleClickEdit() {
  editing.value = true
  nodeBeingEdited.value = node
}

function handleClickDeleteBtn() {
  removeNodes(node.id)
}

function handleClickDuplicateBtn() {
  const { type, position, data } = node.node
  const newNode = {
    id: (nodes.value.length + 1).toString(),
    type,
    position: {
      x: position.x + 50,
      y: position.y + 50
    },
    data
  }
  addNodes(newNode)
}
</script>

<template>
  <div class="w-[300px] rounded-md border border-gray-200 bg-white p-3 shadow-md">
    <div class="flex flex-col gap-y-1">
      <header class="flex justify-between">
        <p class="text-sm text-gray-500">Field spot</p>

        <div class="flex items-center gap-x-2">
          <Icon
              name="heroicons:pencil-square"
              class="cursor-pointer w-4 h-4 text-green-600 hover:text-green-700"
              @click="handleClickEdit"
          />
          <Icon
              name="heroicons:document-duplicate"
              class="cursor-pointer w-4 h-4 text-blue-600 hover:text-blue-700"
              @click="handleClickDuplicateBtn"
          />
          <Icon
              name="heroicons:trash"
              class="cursor-pointer w-4 h-4 text-red-600 hover:text-red-700"
              @click="handleClickDeleteBtn"
          />
        </div>
      </header>

      <p class="text-xs">Node id: {{ node.id }}</p>

      <div class="flex flex-col">
        <div class="rounded-md bg-gray-100 p-1">
          <p class="text-sm">
            Scene: {{ scene }}
          </p>
        </div>
      </div>
    </div>
    <Handle id="handle-w" type="source" style="width: 11px;height: 11px;background-color: white;border: 1px solid black;" :position="Position.Left" />
    <Handle id="handle-e" type="source" style="width: 12px;height: 12px;background-color: blue;" :position="Position.Right"/>
    <Handle id="handle-n" type="source" style="width: 12px;height: 12px;background-color: black;" :position="Position.Top" />
    <Handle id="handle-s" type="source" style="width: 12px;height: 12px;background-color: red;" :position="Position.Bottom" />
  </div>
</template>
