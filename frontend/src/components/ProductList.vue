<script setup lang="ts">
import { onMounted, toRef } from 'vue'
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
const { page, totalPages, products, hasProducts, error, limit, loading } = storeToRefs(productStore)

/** Функция смены страницы */
function changePage(newPage: number) {
  if (newPage < 1 || newPage > totalPages.value) return
  productStore.fetchProducts(newPage, limit.value)
}

function makeGalleria(product: Product): GalleriaValue[] {
  return product.imageUrls.map((url) => ({
    imageSrc: url,
    alt: product.title,
  }))
}

// При монтировании загружаем первую страницу
// поддержка квери параметров которые через строку браузера задаем нужна
onMounted(() => {
  productStore.fetchProducts(page.value, limit.value)
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="mb-4 text-2xl font-bold">Список товаров</h1>

    <!-- Отображаем сообщение об ошибке -->
    <div v-if="error" class="mb-4 text-red-600">
      {{ error }}
    </div>

    <!-- Кнопки пагинации ↑↓ -->
    <div class="mb-4 flex items-center justify-between">
      <button
        :disabled="page <= 1 || loading"
        @click="changePage(page - 1)"
        class="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
      >
        ← Назад
      </button>
      <span> Страница {{ page }} из {{ totalPages }} </span>
      <button
        :disabled="page >= totalPages || loading"
        @click="changePage(page + 1)"
        class="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:opacity-50"
      >
        Вперед →
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="loading">
        <Skeleton v-for="num of 20" :key="num" class="!h-108" />
      </template>

      <template v-if="!loading && hasProducts">
        <Card v-for="prod in products" :key="prod.id" class="card">
          <template #header>
            <Galleria
              containerClass="galleria"
              :value="makeGalleria(prod)"
              :numVisible="5"
              :circular="true"
              :showThumbnails="false"
              :showIndicators="true"
              :show-item-navigators="true"
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
              {{ prod.title }}
            </div>
          </template>

          <template #subtitle>
            {{ convertCategory(prod.category) }}
          </template>

          <template #content>
            <span class="text-xl font-semibold text-violet-500">{{ formatPrice(prod.price) }}</span>
          </template>

          <template #footer>
            <div class="mt-4">
              <RouterLink :to="{ name: 'product-detail', params: { id: prod.id } }">
                <Button label="Посмотреть" class="w-full" />
              </RouterLink>
            </div>
          </template>
        </Card>
      </template>

      <span v-if="!loading && !hasProducts" class="col-span-full text-center text-gray-500">
        Нет доступных товаров.
      </span>
    </div>
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
