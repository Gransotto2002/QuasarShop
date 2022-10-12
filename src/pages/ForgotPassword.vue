<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="col-12 text-h5 text-center"> Password Reset </p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">

        <q-input
          label="Email"
          v-model="email"
          type="email"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Email is required']"
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
  import { defineComponent, ref } from "vue";
  import useAuthUser from "src/composables/useAuthUser";
  import useNotify from "src/composables/useNotify";

  export default defineComponent({
    
    setup(){
      const { sendPasswordRestEmail } = useAuthUser()
      const {notifyError, notifySucess} = useNotify()
      const email = ref('')
 
      const handlePasswordReset = async () => {
        try{
          await sendPasswordRestEmail(email.value)
          notifySucess(`Confirm your email ${email.value}`)
        }catch(error){
          notifyError(error.message)
        }
      }

      return{
        email,
        handlePasswordReset
      }
    }

  })
  
</script>