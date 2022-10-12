<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p>Form Product</p>
      </div>
      <q-form class="col-md-6 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">

        <q-input 
          label="Image"
          stack-label
          v-model="img"
          type="file"
          accept="image/*"
        />

      <q-input
        label="Nome"
        v-model="form.name"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Nome é obrigatório !']"
      />

      <q-editor 
        v-model="form.description" 
        placeholder="Descrição do produto"
        min-height="5rem" 
      />

      <q-input
        label="Quantidade"
        v-model="form.amount"
        type="number"
        lazy-rules
        :rules="[val => (val && !!val) || 'Quantidade é obrigatório !']"
      />

      <q-input
        label="Preço"
        v-model="form.price"
        prefix="R$"
        lazy-rules
        :rules="[val => (val && !!val) || 'Valor é obrigatório !']"
      />

      <q-select
        v-model="form.category_id"
        :options="optionsCategory"
        label="Category"
        option-value="id"
        option-label="name"
        map-options
        emit-value
        :rules="[val => !!val || 'Categoria é obrigatória !' ]"
      />



      <q-btn
        :label="isUpdate ? 'Update' : 'Save'"
        color="primary"
        class="full-width"
        type="submit"
        rounded
      />

      <q-btn
        label="Cancel"
        color="negative"
        class="full-width"
        rounded
        flat
        :to="{name: 'product'}"
      />
     
    </q-form> 
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'PageFormProduct',
  setup(){
    const table = 'product'
    const router = useRouter()
    const route = useRoute()
    const { post, getById, update, listPublic, uploadImg } = useApi()
    const { notifyError, notifySucess} = useNotify()
    const { user } = useAuthUser()
    const isUpdate = computed(() => route.params.id)
    
    let product = {}
    const optionsCategory = ref([])
    const form = ref({
      name: '',
      description: '',
      amount: 0,
      price: 0,
      category_id: '',
      img_url: ''
    })

    const img = ref([])

    const handleSubmit = async () => {
      try{
        if(img.value.length > 0){
          const imgUrl = await uploadImg(img.value[0], 'products')
          form.value.img_url = imgUrl 
        }


        if(isUpdate.value){
          await update(table, form.value)
          notifySucess('Update Sucessfull')
          router.push({name : 'product'})
        } else {
          await post(table, form.value)
          notifySucess('Product added')
          router.push({name : 'product'})
        }
      }catch(error){
        notifyError(error.message)
      }
    }

    const handleGetProduct = async id => {
      try{
        product = await getById(table, id)
        form.value = product
      }catch(error){
        notifyError(error.message)
      }
    }

    const handleListCategories = async () => {
      optionsCategory.value = await listPublic('category', user.value.id)
    }

    onMounted(() => {
      handleListCategories()
      if(isUpdate.value){
        handleGetProduct(isUpdate.value)
      }
    })

    return{
      handleSubmit,
      form,
      isUpdate,
      optionsCategory,
      img
    }
  }
})
</script>