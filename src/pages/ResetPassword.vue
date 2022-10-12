<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="col-12 text-h5 text-center"> Password Reset </p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">

        <q-input
          label="Insira sua nova senha"
          type="password"
          v-model="password"
          lazy-rules
          :rules="[val => (val && val.length >=6) || 'New password is required, min 6 characters']"
        />

        <div class="full-width q-gutter-y-md">
          <q-btn
            label="Send Email"
            color="primary"
            class="full-width"
            rounded
            type="submit"
          />


          <q-btn
            label="Back"
            color="primary"
            class="full-width"
            rounded
            outline
            :to="{name : 'login'}"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
  import {defineComponent, ref} from 'vue'
  import useAuthUser from 'src/composables/useAuthUser';
  import { useRouter, useRoute } from 'vue-router'
  import useNotify from 'src/composables/useNotify';

  export default defineComponent({
    name: 'PageResetPassword',

    setup(){
      const { resetPassword } = useAuthUser()
      const router = useRouter()
      const route = useRoute()
      const {notifyError, notifySucess} = useNotify()
      const token = route.query.token

      const password = ref('')

      const handlePasswordReset = async () => {
        try{
          await resetPassword(token, password.value)
          notifySucess('Reset Password Sucessfull')
          router.push({name : 'login'})
        }catch(error){
          notifyError(error.message)
        }
       

      }
      return{
        password,
        handlePasswordReset
      }
    }
  })
</script>