<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
import Galleria from 'primevue/galleria'
import Button from 'primevue/button'
import { useProductStore } from '@/stores/product'
import { formatPrice } from '@/utils/formatPrice'
import { convertCategory } from '@/utils/convertCategory'
import type { Product } from '@/dto/Product.dto'

interface GalleriaValue {
  imageSrc: string
  alt: string
}

const productStore = useProductStore()
const { products, hasProducts, error, loading } = storeToRefs(productStore)

function makeGalleria(product: Product): GalleriaValue[] {
  return product.imageUrls.map((url) => ({
    imageSrc: url,
    alt: product.title,
  }))
}
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <template v-if="loading">
      <Skeleton v-for="num of 20" :key="num" class="!h-108" />
    </template>

    <template v-if="!loading && hasProducts">
      <Card v-for="product in products" :key="product.id" class="card">
        <template #header>
          <Galleria
            containerClass="galleria"
            :value="makeGalleria(product)"
            :circular="true"
            :showThumbnails="false"
            :showItemNavigators="true"
            :showItemNavigatorsOnHover="true"
            :showIndicators="true"
            :changeItemOnIndicatorHover="true"
          >
            <template #item="{ item }">
              <img
                class="block aspect-[4/3] w-full object-cover"
                :src="item.imageSrc"
                :alt="item.alt"
              />
            </template>
          </Galleria>
        </template>

        <template #title>
          <div class="truncate">
            {{ product.title }}
          </div>
        </template>

        <template #subtitle>
          {{ convertCategory(product.category) }}
        </template>

        <template #content>
          <span class="text-xl font-semibold text-violet-500">{{
            formatPrice(product.price)
          }}</span>
        </template>

        <template #footer>
          <div class="mt-4">
            <RouterLink :to="{ name: 'product-detail', params: { id: product.id } }">
              <Button label="Посмотреть" class="w-full" />
            </RouterLink>
          </div>
        </template>
      </Card>
    </template>

    <span v-if="!loading && !hasProducts && !error" class="col-span-full text-center text-gray-500">
      Нет доступных товаров.
    </span>

    <span v-if="error" class="col-span-full text-center text-red-600">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.card {
  --p-card-title-font-size: 1rem;
  --p-card-caption-gap: 0.125rem;
}

:deep(.p-card-body) {
  flex-grow: 1;
}

:deep(.p-card-footer) {
  margin-top: auto;
}

:deep(.p-card-subtitle) {
  font-size: 0.875rem;
}

.galleria {
  --p-galleria-nav-button-background: rgba(0, 0, 0, 0.5);
  --p-galleria-nav-button-hover-background: rgba(0, 0, 0, 0.7);
}

:deep(.p-galleria-indicator-list) {
  overflow: auto;
  justify-content: start;
}
</style>
