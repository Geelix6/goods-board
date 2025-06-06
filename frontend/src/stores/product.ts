import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/dto/Product.dto'
import type { PaginatedResult } from '@/dto/PaginatedResult.dto'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const page = ref(1)
  const limit = ref(20)
  const total = ref(0)
  const totalPages = ref(1)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  async function fetchProducts(p: number = 1, l: number = 20) {
    loading.value = true
    await new Promise((resolve) => setTimeout(resolve, 1211))
    error.value = null

    try {
      page.value = p
      limit.value = l

      const res = await fetch(`${API_BASE_URL}?page=${p}&limit=${l}`)
      if (!res.ok) {
        throw new Error(`Ошибка загрузки: ${res.status}`)
      }

      const json: PaginatedResult<Product> = await res.json()
      products.value = json.data
      total.value = json.total
      totalPages.value = json.totalPages
    } catch (e: any) {
      error.value = e.message || 'Unknown error'
      products.value = []
      total.value = 0
      totalPages.value = 1
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id: string): Promise<Product | null> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`)

      if (!res.ok) {
        throw new Error(`Ошибка загрузки продукта: ${res.status} ${res.statusText}`)
      }
      return await res.json()
    } catch (e: any) {
      error.value = e.message || 'Unknown error'
      return null
    } finally {
      loading.value = false
    }
  }

  const hasProducts = computed(() => products.value.length > 0)

  return {
    products,
    total,
    page,
    limit,
    totalPages,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    hasProducts,
  }
})
