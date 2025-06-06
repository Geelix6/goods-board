import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: string
  title: string
  category: string
  imageUrls: string[]
  price: number
  description: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const totalPages = ref(1)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Базовый URL бэкенда (предполагаем, что фронтенд и бэкенд на одной доменной зоне; иначе укажите полный адрес)
  const API_BASE = '/api/products'

  /** Загружает продукты c бекенда, учитывая page и limit */
  async function fetchProducts(p: number = 1, l: number = 20) {
    loading.value = true
    error.value = null
    try {
      page.value = p
      limit.value = l
      const res = await fetch(`${API_BASE}?page=${p}&limit=${l}`)
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

  /** Получить единичный продукт по ID */
  async function fetchProductById(id: string): Promise<Product | null> {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_BASE}/${id}`)
      if (res.status === 404) {
        return null
      }
      if (!res.ok) {
        throw new Error(`Ошибка загрузки продукта: ${res.status}`)
      }
      const prod: Product = await res.json()
      return prod
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
