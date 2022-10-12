<template>
  <q-page padding>
    <div class="row">
      <q-table
      class="col-12"
      :rows="products"
      :columns="columnsProducts"
      row-key="name"
      :loading="loading"
    >
      <template v-slot:top>
        <span class="text-h6">
          Products
        </span>

        <q-btn 
          label="My Store"
          dense
          size="sm"
          outline
          class="q-ml-md"
          icon="mdi-store"
          color="primary"
          @click="handleGoToStore"
        />

        <q-btn 
          label="Copy Link"
          dense
          size="sm"
          outline
          class="q-ml-md"
          icon="mdi-content-copy"
          color="primary"
          @click="handleCopyLink"
        />

        <q-space />
          <q-btn
          v-if="$q.platform.is.desktop"
          label="Add New"
          color="primary"
          icon="mdi-plus"
          :to="{name: 'form-product'}"
          />
      </template>

      <template v-slot:body-cell-img_url="props">
        <q-td :props="props">
          <q-avatar v-if="props.row.img_url">
            <img rounded :src="props.row.img_url">
          </q-avatar>
          <q-avatar v-else color="grey" text-color="white" icon="mdi-image-off" />
        </q-td>
      </template>
  
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn icon="mdi-pencil-outline" color="primary" dense @click="handleEdit(props.row)"
          >
            <q-tooltip class="bg-indigo" :offset="[10, 10]">
              Editar
            </q-tooltip>
          </q-btn>
          <q-btn icon="mdi-delete-outline" color="negative"  dense @click="handleRemoveProduct(props.row)"
          >
            <q-tooltip class="bg-negative" :offset="[10, 10]" >
              Excluir
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    </div>
    <q-page-sticky 
      position="bottom-right" 
      :offset="[18, 18]"
    >
      <q-btn 
        fab icon="mdi-plus"  
        :to="{name: 'form-product'}" 
        color="primary" 
        v-if="$q.platform.is.mobile"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import {columnsProducts} from './table'  
import { defineComponent, ref, onMounted} from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import { useRouter } from 'vue-router'
import { useQuasar, openURL, copyToClipboard} from 'quasar'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'ProductList',
  setup(){
    const products = ref([])
    const { listPublic, remove } = useApi()
    const { notifyError, notifySucess  } = useNotify()
    const router = useRouter()
    const loading = ref(true)
    const $q = useQuasar()
    const table = 'product'
    const { user } = useAuthUser()


    const handleListProducts = async () => {
      try{
        loading.value = true
        products.value = await listPublic(table, user.value.id)
        loading.value = false
      }catch(error){
        notifyError(error.message)
      }
    }

    const handleRemoveProduct = async product => {
      try{
        $q.dialog({
          title: 'Excluir',
          message: `Deseja mesmo deletar "${product.name}" ?`,
          cancel: true,
          persistent: true
        })
        .onOk( async () => {
          await remove(table, product.id)
          notifySucess('Produto excluído com sucesso')
          handleListProducts()
        })
      }catch(error){
        notifyError(error.message)
      }
    }

    const handleEdit = (product => {
      router.push({name : 'form-product', params : {id : product.id}})
    })

    const handleGoToStore = () => {
      const idUser = user.value.id
      const link = router.resolve({name: 'public-products', params: {id: idUser}})
      openURL(window.origin + link.href)
    }

    const handleCopyLink = () => {
      const idUser = user.value.id
      const link = router.resolve({name: 'public-products', params: {id: idUser}})
      const externalLink = window.origin + link.href
      copyToClipboard(externalLink)
        .then(() => {
          notifySucess('Link copiado para a área de transferência')
        }).catch(error =>{
          notifyError(error)
        })
    }

    onMounted(() => {
        handleListProducts()
    })

    return{
      columnsProducts,
      products,
      loading,
      handleGoToStore,
      handleEdit,
      handleRemoveProduct,
      handleCopyLink
    }
  }
})

</script>