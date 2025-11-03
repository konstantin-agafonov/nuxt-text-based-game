<script setup lang="ts">
const scenarioStore = useScenarioStore()
const { nodeBeingEdited, someNodeIsBeingEdited } = storeToRefs(scenarioStore)

const handleClose = () => {
  nodeBeingEdited.value = null
}
</script>

<template>
  <aside 
    :class="[
      'bg-white border-l border-black transition-all duration-300 ease-in-out ' +
      'absolute w-[400px] top-0 bottom-0 flex flex-col gap-y-1 p-1',
      someNodeIsBeingEdited ? 'right-0' : 'right-[-400px]'
    ]"
  >
    <div class="absolute top-2 right-2">
      <Icon
          name="heroicons:document-duplicate"
          class="cursor-pointer w-6 h-6 text-blue-600 hover:text-blue-700"
          title="Duplicate"
          @click="handleClickDuplicateBtn"
      />
      <Icon
          name="heroicons:trash"
          class="cursor-pointer w-6 h-6 text-red-600 hover:text-red-700"
          title="Delete"
          @click="handleClickDeleteBtn"
      />
      <Icon
          name="heroicons:x-circle"
          class="cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-700"
          title="Close"
          @click="handleClose"
      />
    </div>

    <header class="flex flex-col">
      <div class="flex justify-between">
        <p class="text-lg">{{ nodeBeingEdited?.node.type }}: node name</p>
      </div>
      <p class="text-sm">Node id: {{ nodeBeingEdited?.id }}</p>
    </header>
    <div class="flex flex-col gap-y-1">
      <div class="rounded-lg p-2 bg-gray-100">
        <p class="text-md">Scene</p>
        <p class="text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium, eum!
          {{ nodeBeingEdited }}
        </p>
      </div>
    </div>
  </aside>
</template>

<style scoped>

</style>
