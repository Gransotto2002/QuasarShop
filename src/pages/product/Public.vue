<template>
  <q-page padding>
    <div class="row"
      v-if="brand.name"
    >
      <div class="col-12 text-center text-h4 q-mb-md">
        <div class="q-mb-md">
          <q-btn
            v-if="isLoggedIn()" 
            label="Back to my dashboard"
            color="primary"
            rounded
            outline
            :to="{name: 'me'}"
          />
        </div>
        {{brand.name}}

      </div>
    </div>
    <div class="row">
      <q-select 
        outlined 
        v-model="categoryID" 
        :options="optionsCategories" 
        option-label="name"
        option-value="id"
        map-options
        emit-value
        clearable
        label="Category" 
        class="col-12"
        dense
        @update:model-value="handleListProducts(route.params.id)"
      />

      <q-table
        v-model:pagination="initialPagination"
        grid
        class="col-12"
        :rows="products"
        :columns="columnsProducts"
        row-key="name"
        :loading="loading"
        :filter="filter"
        hide-pagination
      >
        <template v-slot:top>
          <span class="text-h6">
            Products
          </span>
          <q-space/>
          <q-input
            dense
            outlined
            debounce="300"
            color="primary"
            v-model="filter"
            placeholder="Search"
            class="q-mr-sm"
          >
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3">
            <q-card class="cursor-pointer" v-ripple:white @click="handleShowDetails(props.row)">
              <q-img :src="props.row.img_url" :ratio="4/3" />
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle-2">{{formatCurrency(props.row.price)}}</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12" v-if="props.rowIndex === 3">
            <q-parallax :height="200" :speed="0.5">
              <template v-slot:media>
                <img :src="brand.parallax_url">
              </template>
              <h1 class="text-white">{{brand.name}}</h1>
            </q-parallax>
           </div>
        </template>
      </q-table>
      <div class="row col-12 justify-center q-mt-md">
        <q-pagination
          v-model="initialPagination.page"
          class="text-center"
          :max="pagesNumber"
          @update:model-value="handleScrollToTop"
          direction-links
        />
      </div>
    </div>
    <dialog-product-details
      :show="showDialogDetails"
      :product="productDetails"
      @hide-dialog="showDialogDetails = false"
    />
  </q-page>
</template>

<script>
import {columnsProducts, initialPagination} from './table'  
import { defineComponent, ref, onMounted, computed} from 'vue'
import useApi from 'src/composables/useApi'
import useNotify from 'src/composables/useNotify'
import  { useRoute } from 'vue-router'
import { formatCurrency } from 'src/utils/format'
import DialogProductDetails from 'components/DialogProductDetails'
import useAuthUser from 'src/composables/useAuthUser'

export default defineComponent({
  name: 'PageProductPublic',
  components:{
    DialogProductDetails
  },
  setup(){
    const products = ref([])
    const { listPublic, brand} = useApi()
    const { notifyError } = useNotify()
    const loading = ref(true)
    const table = 'product'
    const route = useRoute()
    const filter = ref('')
    const showDialogDetails = ref(false)
    const productDetails = ref([])
    const optionsCategories = ref([])
    const { isLoggedIn } = useAuthUser()

    const categoryID = ref('')


    const handleListProducts = async user_id => {
      try{
        loading.value = true
        products.value = categoryID.value ? await listPublic(table, user_id, 'category_id', categoryID.value): 
        await listPublic(table, user_id)
        loading.value = false
      }catch(error){
        notifyError(error.message)
      }
    }

    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const handleListCategories = async (userID) => {
      optionsCategories.value = await listPublic('category', userID)
    }

    const handleShowDetails = product => {
      productDetails.value = product,
      showDialogDetails.value = true
    }

    onMounted(() => {
      if(route.params.id){
        handleListCategories(route.params.id)
        handleListProducts(route.params.id)
        console.log(brand.value.parallax_url);
      }
    })

    return{
      handleListProducts,
      handleShowDetails,
      formatCurrency,
      isLoggedIn,
      columnsProducts,
      products,
      loading,
      filter,
      showDialogDetails,
      productDetails,
      brand,
      optionsCategories,
      categoryID,
      route,
      initialPagination,
      handleScrollToTop,
      pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowsPerPage))
    }
  }
})

</script>