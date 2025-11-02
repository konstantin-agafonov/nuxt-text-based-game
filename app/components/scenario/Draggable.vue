<script setup>
function handleDragStart(event, nodeType) {
  event.dataTransfer.setData("node", nodeType);
}
</script>

<template>
  <div
      draggable="true"
      @dragstart="handleDragStart($event, 'input')">
    Draggable
  </div>
</template>
