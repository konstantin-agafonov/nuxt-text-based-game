import type {Elements} from "@vue-flow/core";

export const useScenarioStore = defineStore('scenarioStore', () => {
  const scenario = ref<Elements>([])
  const nodeBeingEdited = ref(null)
  const someNodeIsBeingEdited = computed(() => nodeBeingEdited.value !== null)

    /*watch(nodeBeingEdited, (next) => {
      console.log(next)
  }, {deep: true, immediate: true})*/

  return {
    scenario,
    nodeBeingEdited,
    someNodeIsBeingEdited
  }
})
