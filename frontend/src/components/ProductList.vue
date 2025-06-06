<script setup lang="ts">
import { onMounted, toRef, computed } from 'vue'
import { useProductStore } from '../stores/product'
import ProductCard from './ProductCard.vue'

// Ссылка на стор
const productStore = useProductStore()

// Локальный реактивный page и limit
const page = toRef(productStore, 'page')
const totalPages = toRef(productStore, 'totalPages')
const products = toRef(productStore, 'products')
const hasProducts = toRef(productStore, 'hasProducts')

// При монтировании загружаем первую страницу
onMounted(() => {
  productStore.fetchProducts(page.value, productStore.limit)
})

/** Функция смены страницы */
function changePage(newPage: number) {
  if (newPage < 1 || newPage > totalPages.value) return
  productStore.fetchProducts(newPage, productStore.limit)
}
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Список товаров</h1>

    <!-- Отображаем сообщение об ошибке -->
    <div v-if="productStore.error" class="text-red-600 mb-4">
      {{ productStore.error }}
    </div>

    <!-- Кнопки пагинации ↑↓ -->
    <div class="flex justify-between items-center mb-4">
      <button
        :disabled="page <= 1 || productStore.loading"
        @click="changePage(page - 1)"
        class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        ← Назад
      </button>
      <span> Страница {{ page }} из {{ totalPages }} </span>
      <button
        :disabled="page >= totalPages || productStore.loading"
        @click="changePage(page + 1)"
        class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Вперед →
      </button>
    </div>

    <!-- Grid с карточками -->
    <div
      v-if="!productStore.loading && hasProducts"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <ProductCard v-for="prod in products" :key="prod.id" :product="prod" />
    </div>

    <!-- Спиннер при загрузке -->
    <div v-if="productStore.loading" class="flex justify-center py-10">
      <svg
        class="animate-spin h-8 w-8 text-indigo-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3.5-3.5L12 4v4a8 8 0 10-8 8h4l-3.5 3.5L4 12z"
        ></path>
      </svg>
    </div>

    <!-- Если нет товаров и не loading -->
    <div v-if="!productStore.loading && !hasProducts" class="text-gray-500 text-center py-10">
      Нет доступных товаров.
    </div>
  </div>
</template>
