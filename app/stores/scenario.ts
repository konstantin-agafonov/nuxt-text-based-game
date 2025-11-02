import type {Elements} from "@vue-flow/core";

export const useScenarioStore = defineStore('scenatioStore', () => {
  const scenario = ref<Elements>([
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
  ])

  /*watch(scenario, (next) => {
      console.log(next)
  }, {deep: true, immediate: true})*/

  return {
    scenario
  }
})
