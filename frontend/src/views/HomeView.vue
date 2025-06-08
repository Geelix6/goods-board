<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import Paginator from 'primevue/paginator'
import ProductList from '../components/ProductList.vue'
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()
const { page, limit, total } = storeToRefs(productStore)

const sentinel = ref(null)
const paginator = ref(null)
const isSticky = ref(false)

let observer

onMounted(() => {
  productStore.fetchProducts(page.value, limit.value)

  observer = new IntersectionObserver(
    ([entry]) => {
      // когда sentinel уходит за верхнюю границу,—значит пагинатор "прилип"
      isSticky.value = entry.boundingClientRect.y < 0
    },
    {
      root: null,
      threshold: [0],
      // смещаем «зону пересечения» ровно на высоту top-2 (8px),
      // чтобы пограничный момент совпадал с фактом прилипания
      rootMargin: `-8px 0px 0px 0px`,
    },
  )
  if (sentinel.value) observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value)
  }
})
</script>

<template>
  <h1 class="mb-4 text-2xl font-bold">Список товаров</h1>

  <div ref="sentinel" class="h-px"></div>
  <Paginator
    class="sticky top-2 z-10 mb-4 w-fit transition-all duration-300"
    ref="paginator"
    :class="{ 'sticky-active': isSticky }"
    :rows="limit"
    :totalRecords="total"
    :rowsPerPageOptions="[1, 8, 20, 40]"
    @page="(e) => productStore.fetchProducts(e.page + 1, e.rows)"
  />
  <ProductList class="mb-8" />
</template>

<style scoped>
:deep(.p-paginator) {
  justify-content: start;
  background-color: var(--p-paginator-background, transparent);
  transition: 0.2s ease-in-out;
}

.sticky-active :deep(.p-paginator) {
  --p-paginator-background: rgba(0, 0, 0, 0.5);
  --p-paginator-nav-button-color: white;
}
</style>
