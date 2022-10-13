<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          ShopV2
        </q-toolbar-title>
        <q-btn-dropdown color="primary" icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
         </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Home',
    caption: '',
    icon: 'mdi-folder-home',
    routeName: 'me'
  },
  {
    title: 'Category',
    caption: '',
    icon: 'mdi-shape',
    routeName: 'category'
  },
  {
    title: 'Products',
    caption: '',
    icon: 'mdi-archive',
    routeName: 'product'
  },
  {
    title: 'Config',
    caption: '',
    icon: 'mdi-cog',
    routeName: 'form-config'
  },
]

import { defineComponent, ref, onMounted} from 'vue'
import useAuthUser from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'
import {useQuasar} from 'quasar'
import useApi from 'src/composables/useApi'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const router = useRouter()
    const { logout } = useAuthUser()
    const $q = useQuasar()
    const { getBrand  } = useApi()

    onMounted(() => {
      getBrand()
    })

    const handleLogout = async () => {

      $q.dialog({
        title: 'Logout',
        message: 'Você realmente quer sair ?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await logout()
        router.replace({name : 'login'})
      })

    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      handleLogout
    }
  }
})
</script>
