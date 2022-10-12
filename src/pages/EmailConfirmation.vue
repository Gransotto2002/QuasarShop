<template>
  <q-page padding>
    <p class="text-body1">
      Confirmação de email
    </p>

    <p class="text-body1">
      Para continuar por favor confime seu email <strong> {{$route.query.email}} </strong>
    </p>

    <div class="row justify-center q-mt-lg">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-btn
          label="Back"
          color="dark"
          class="full-width"
          rounded
          :to="{name : 'login'}"
        />
      </div>
    </div>
    
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EmailConfirmation'
})
</script>
