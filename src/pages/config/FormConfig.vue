<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p>Config</p>
      </div>
      <q-form class="col-md-6 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        
      <q-input
        label="Store Name"
        v-model="form.name"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Name is required !']"
      />

      <q-input
        label="Phone"
        v-model="form.phone"
        mask="(##) #####-####"
        unmasked-value
      />

      <div class="row justify-center q-gutter-md q-pa-md">
          <q-color class="col-md-4 col-sm-12 col-xs-12" v-model="form.primary"/>
          <q-color class="col-md-4 col-sm-12 col-xs-12" v-model="form.secondary"/>
      </div>

      <q-input 
          label="Image Parallax"
          stack-label
          v-model="parallax"
          type="file"
          accept="image/*"
        />

      <q-btn
        label="Save"
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
        :to="{name: 'me'}"
      />
     
    </q-form> 
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import useBrand from 'src/composables/useBrand'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'PageFormConfig',
  setup(){
    const table = 'config'
    const router = useRouter()
    const { post, listPublic, update, uploadImg} = useApi()
    const { notifyError, notifySucess} = useNotify()
    const { setBrand } = useBrand()
    const { user } = useAuthUser()
    const parallax = ref([])
    
    
    let config = {}
    const form = ref({
      name: '',
      phone: '',
      primary: '',
      secondary: '',
      parallax_url: ''
    })

    const handleSubmit = async () => {
      try{
        if(parallax.value.length > 0){
          const parallax_url = await uploadImg(parallax.value[0], 'parallax')
          form.value.parallax_url = parallax_url 
        }

        if(form.value.id){
          await update(table, form.value)
          notifySucess('Update Sucessfull')
        } else {
          await post(table, form.value)
          notifySucess('Product added')
        }
        setBrand(form.value.primary, form.value.secondary)
        router.push({name: 'me'})
      }catch(error){
        notifyError(error.message)
      }
    }
    
    const handleGetConfig = async () => {
      try{
        config = await listPublic(table, user.value.id)
        form.value = config[0]
      }catch(error){
        notifyError(error.message)
      }
    }
    const handleVerifyConfig = async () => {
      const data = await listPublic(table, user.value.id)

      if (data.length == 0) {
        return
      }
      handleGetConfig()
    }


    onMounted(() => {
      handleVerifyConfig()
    })

    return{
      handleSubmit,
      form,
      parallax
    }
  }
})
</script>