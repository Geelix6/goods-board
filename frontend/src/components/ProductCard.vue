<template>
  <div
    class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
  >
    <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
      <!-- Картинка: если есть хотя бы один URL, показываем первый -->
      <div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          v-if="product.imageUrls.length"
          :src="product.imageUrls[0]"
          alt="Product Image"
          class="object-cover h-full w-full"
        />
        <span v-else class="text-gray-400">No Image</span>
      </div>
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-1">{{ product.title }}</h2>
        <p class="text-sm text-gray-500 mb-2 capitalize">{{ humanCategory(product.category) }}</p>
        <p class="text-xl font-bold text-green-600 mb-2">${{ product.price }}</p>
        <button class="text-indigo-600 hover:underline text-sm" @click.stop="">Подробнее →</button>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../stores/product'

// props
defineProps<{
  product: Product
}>()

/** Преобразует enum Category в более читаемую строку */
function humanCategory(category: string): string {
  return category.toLowerCase().replace(/_/g, ' ')
}
</script>

<style scoped>
/* никаких дополнительных стилей, всё делаем через Tailwind */
</style>
