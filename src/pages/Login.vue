<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center"> Login </p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Email"
          v-model="form.email"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Email is required']"
        />
        
        
        <q-input
          label="Password"
          v-model="form.password"
          type="password"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Password is required']"
        />
       

        <div class="full-width q-pt-lg">
          <q-btn
            label="Login"
            color="primary"
            class="full-width"
            rounded
            type="submit"
          />


          <q-btn
            label="Register"
            color="primary"
            class="full-width q-mt-lg"
            outline
            rounded
            to="/register"
          />

          <q-btn
            label="Forgot Password ?"
            color="positive"
            class="full-width q-mt-lg"
            flat
            size="12px"
            to="/forgot-password"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted} from 'vue'
import useAuthUser from 'src/composables/useAuthUser'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/useNotify'

export default defineComponent({
  name: 'Login',
   setup(){
    const { notifyError, notifySucess } = useNotify()

    const router = useRouter()
    const { login, isLoggedIn } = useAuthUser()

    const form = ref({
      email:'',
      password: ''
    })

    const handleLogin = async () => {
      try{
        await login(form.value)
        notifySucess()
        router.push({name: 'me'})
      }catch(error){
        notifyError(error.message)
      }
    }


    onMounted(() => {
      if(isLoggedIn){
        router.push({name : 'me'})
      }
    })

    return{
      form,
      handleLogin
    }
   }
})
</script>
