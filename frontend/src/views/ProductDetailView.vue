<template>
  <div class="container mx-auto px-4 py-6">
    <button @click="$router.back()" class="mb-4 text-indigo-600 hover:underline">
      ← Назад к списку
    </button>

    <div v-if="loading" class="flex justify-center py-10">
      <svg
        class="h-8 w-8 animate-spin text-indigo-600"
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

    <div v-if="productStore.error" class="flex flex-col gap-y-2 text-red-600">
      <span>Не удалось загрузить товар или он не существует</span>
      <span>{{ productStore.error }}</span>
    </div>

    <div v-if="product && !loading" class="rounded-lg bg-white p-6 shadow">
      <h1 class="mb-2 text-2xl font-bold">{{ product.title }}</h1>
      <p class="mb-4 text-sm text-gray-500 capitalize">
        {{ humanCategory(product.category) }}
      </p>
      <div class="mb-4">
        <img
          v-for="(url, idx) in product.imageUrls"
          :key="idx"
          :src="url"
          alt="Product Image"
          class="mr-2 inline-block h-48 w-1/3 rounded object-cover"
        />
      </div>
      <p class="mb-4 text-xl font-semibold text-green-600">Цена: ${{ product.price }}</p>
      <p class="mb-4 text-gray-700">{{ product.description }}</p>
      <p class="text-sm text-gray-400">Добавлено: {{ formatDate(product.createdAt) }}</p>
    </div>

    <div v-if="!product && !loading && !productStore.error" class="text-gray-500">
      Товар не найден.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import type { Product } from '@/dto/Product.dto'

const route = useRoute()
const productStore = useProductStore()

const product = ref<Product | null>(null)
const loading = ref(false)
// const error = ref<string | null>(null) // взять error из стора

function humanCategory(category: string): string {
  return category.toLowerCase().replace(/_/g, ' ')
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  // error.value = null
  const res = await productStore.fetchProductById(id)
  if (res) {
    product.value = res
  } else {
    // error.value = 'Не удалось загрузить товар или он не существует'
  }
  loading.value = false
})
</script>

<style scoped>
/* Всё через Tailwind */
</style>
