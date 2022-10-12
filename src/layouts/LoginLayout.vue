<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Quasar Auth
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

   

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted} from 'vue'
import useApi from 'src/composables/useApi'


export default defineComponent({
  name: 'LoginLayout',

  setup () {
    const { getBrand } = useApi()

    onMounted(() => {
      getBrand()
    })
  }
})
</script>
