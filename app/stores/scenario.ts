import type {Elements} from "@vue-flow/core";

export const useScenarioStore = defineStore('scenatioStore', () => {
  const scenario = ref<Elements>([])
  const nodeBeingEdited = ref(null)

  /*watch(scenario, (next) => {
      console.log(next)
  }, {deep: true, immediate: true})*/

  return {
    scenario,
    nodeBeingEdited
  }
})
