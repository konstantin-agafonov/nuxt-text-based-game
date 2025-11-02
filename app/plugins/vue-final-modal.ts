import { createVfm, VueFinalModal, ModalsContainer } from 'vue-final-modal'
import 'vue-final-modal/style.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('VueFinalModal', VueFinalModal)
    nuxtApp.vueApp.component('ModalsContainer', ModalsContainer)
})
