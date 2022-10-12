<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p>Form category</p>
      </div>
      <q-form class="col-md-6 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
      <q-input
        label="Product Name"
        v-model="form.name"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Name is required !']"
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
        :to="{name: 'category'}"
      />
     
    </q-form> 
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounte, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'

export default defineComponent({
  name: 'PageFormCategory',
  setup(){
    const table = 'category'
    const router = useRouter()
    const route = useRoute()
    const { post, getById, update } = useApi()
    const { notifyError, notifySucess} = useNotify()
    const isUpdate = computed(() => route.params.id)
    
    let category = {}
    const form = ref({
      name: ''
    })

    const handleSubmit = async () => {
      try{
        if(isUpdate.value){
          await update(table, form.value)
          notifySucess('Update Sucessfull')
          router.push({name : 'category'})
        } else {
          await post(table, form.value)
          notifySucess('Product added')
          router.push({name : 'category'})
        }
      }catch(error){
        notifyError(error.message)
      }
    }

    onMounted(() => {
      if(isUpdate.value){
        handleGetCategory(isUpdate.value)
      }
    })

    const handleGetCategory = async id => {
      try{
        category = await getById(table, id)
        form.value = category
      }catch(error){
        notifyError(error.message)
      }
    }

    return{
      handleSubmit,
      form,
      isUpdate
    }
  }
})
</script>