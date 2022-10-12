<template>
  <q-dialog
    :full-width="$q.platform.is.mobile"
    :model-value="show"
    @before-hide="handleClose"
    persistent
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Detalhes
        </div>
      </q-card-section>
      <q-card-section>
        <q-img :src="product.img_url" :ratio="4/3" style="min-width: 300px"/>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">
          {{product.name}}
        </div>
        <div class="text-subtitle-2">
          {{formatCurrency(product.price)}}
        </div>
        <div class="text-body-2" v-html="product.description"></div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Cancel"
          color="negative"
          v-close-popup
          icon="mdi-close-box"
        />

        <q-btn
          v-if="brand.phone"
          label="Fazer Pedido"
          color="primary"
          v-close-popup
          icon="mdi-whatsapp"
          @click="handleWhatsapp"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted} from "vue";
import { formatCurrency } from "src/utils/format";
import { openURL } from "quasar";
import useApi from 'src/composables/useApi'


export default defineComponent({
  name: 'DialogProductDetails',
  props:{
    show:{
      type: Boolean,
      required: true
    },
    product: {
      type: Object
    }
  },
  setup(props, {emit}){
    const { brand } = useApi()

    const msg = 'Gostaria de fazer o pedido do item:'
    const handleClose = () => {
      emit('hideDialog')
    }

    const handleWhatsapp = () => {
      const link = encodeURI(`https://api.whatsapp.com/send?phone=55${brand.value.phone}&text=${msg}${props.product.name} - ${formatCurrency(props.product.price)}`)
      openURL(link)
    }

/*     onMounted(() => {
      handleGetBrand()
    }) */


    return{
      formatCurrency,
      handleClose,
      handleWhatsapp,
      brand
    }
  }

})
</script>