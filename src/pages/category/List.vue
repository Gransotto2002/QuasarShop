<template>
  <q-page padding>
    <div class="row">
      <q-table
      class="col-12"
      :rows="categories"
      :columns="columnsCategories"
      row-key="name"
      :loading="loading"
    >
      <template v-slot:top>
        <span class="text-h6">
          Category
        </span>
        <q-space />
          <q-btn
          v-if="$q.platform.is.desktop"
          label="Add New"
          color="primary"
          icon="mdi-plus"
          :to="{name: 'form-category'}"
          />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn icon="mdi-pencil-outline" color="primary" dense @click="handleEdit(props.row)"
          >
            <q-tooltip class="bg-indigo" :offset="[10, 10]">
              Editar
            </q-tooltip>
          </q-btn>
          <q-btn icon="mdi-delete-outline" color="negative"  dense @click="handleRemoveCategory(props.row)"
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
        :to="{name: 'form-category'}" 
        color="primary" 
        v-if="$q.platform.is.mobile"
      />
    </q-page-sticky>
  </q-page>
</template>

<script>
import {columnsCategories} from './table'  
import { defineComponent, ref, onMounted} from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import useAuthUser from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'CategoryList',
  setup(){
    const categories = ref([])
    const { listPublic, remove } = useApi()
    const { user } = useAuthUser()
    const { notifyError, notifySucess  } = useNotify()
    const router = useRouter()
    const loading =ref(true)
    const $q = useQuasar()
    const table = 'category'

    const handleListCategories = async () => {
      try{
        loading.value = true
        categories.value = await listPublic(table, user.value.id)
        loading.value = false
      }catch(error){
        notifyError(error.message)
      }
    }

    const handleRemoveCategory = async category => {
      try{
        $q.dialog({
          title: 'Excluir',
          message: `Deseja mesmo deletar "${category.name}" ?`,
          cancel: true,
          persistent: true
        })
        .onOk( async () => {
          await remove(table, category.id)
          notifySucess('Produto excluído com sucesso')
          handleListCategories()
        })
      }catch(error){
        notifyError(error.message)
      }
      
    }

    const handleEdit = (category => {
      router.push({name : 'form-category', params : {id : category.id}})
    })

    onMounted(() => {
      handleListCategories()
    })

    return{
      columnsCategories,
      categories,
      loading,
      handleEdit,
      handleRemoveCategory
    }
  }
})

</script>