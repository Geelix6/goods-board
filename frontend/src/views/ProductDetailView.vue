<template>
  <div class="container mx-auto px-4 py-6">
    <button @click="$router.back()" class="mb-4 text-indigo-600 hover:underline">
      ← Назад к списку
    </button>

    <div v-if="loading" class="flex justify-center py-10">
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

    <div v-if="error" class="text-red-600">
      {{ error }}
    </div>

    <div v-if="product && !loading" class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-2">{{ product.title }}</h1>
      <p class="text-sm text-gray-500 mb-4 capitalize">
        {{ humanCategory(product.category) }}
      </p>
      <div class="mb-4">
        <img
          v-for="(url, idx) in product.imageUrls"
          :key="idx"
          :src="url"
          alt="Product Image"
          class="inline-block w-1/3 h-48 object-cover rounded mr-2"
        />
      </div>
      <p class="text-xl font-semibold text-green-600 mb-4">Цена: ${{ product.price }}</p>
      <p class="text-gray-700 mb-4">{{ product.description }}</p>
      <p class="text-gray-400 text-sm">Добавлено: {{ formatDate(product.createdAt) }}</p>
    </div>

    <div v-if="!product && !loading && !error" class="text-gray-500">Товар не найден.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore, type Product } from '../stores/product'

const route = useRoute()
const productStore = useProductStore()

const product = ref<Product | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

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
  error.value = null
  const res = await productStore.fetchProductById(id)
  if (res) {
    product.value = res
  } else {
    error.value = 'Не удалось загрузить товар или он не существует'
  }
  loading.value = false
})
</script>

<style scoped>
/* Всё через Tailwind */
</style>
