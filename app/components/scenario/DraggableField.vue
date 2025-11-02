<script setup>
function handleDragStart(event, nodeType) {
  event.dataTransfer.setData("node", nodeType);
}
</script>

<template>
  <div
      class="cursor-grab rounded-md bg-white p-3 shadow-md"
      draggable="true"
      @dragstart="handleDragStart($event, 'field')">
    Field Node
  </div>
</template>
