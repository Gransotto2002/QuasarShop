<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="col-12 text-h5 text-center"> Register </p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Name"
          v-model="form.name"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Name is required']"
        />

        <q-input
          label="Email"
          v-model="form.email"
          type="email"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Email is required']"
        />

        <q-input
          label="Password"
          v-model="form.password"
          type="password"
          lazy-rules
          :rules="[val => (val && val.length >= 6) || 'Password is required, min 6 characters']"
        />


        <div class="full-width q-gutter-y-md">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            rounded
            type="submit"
          />


          <q-btn
            label="Back"
            color="dark"
            class="full-width"
            flat
            :to="{name : 'login'}"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/useNotify'

export default defineComponent({
  name: 'Register',

  setup(){
    const router = useRouter()
    const {register} = useAuthUser()
    const { notifyError, notifySucess} = useNotify()

    const form = ref({
      name: '',
      email: '',
      password: '',
    })

    const handleRegister = async () => {
      try{
        await register(form.value)
        notifySucess('Register Sucessfull')
        router.push({
          name: 'email-confirmation',
          query:{email: form.value.email}
        })
      }catch(error){
        notifyError(error.message)
      }
    }

    return{
      form,
      handleRegister
    }



  }
})
</script>
