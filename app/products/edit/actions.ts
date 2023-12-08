'use server'

import ProductSchema from '@/app/schemas/productSchema'
import { Product } from '@/app/types/product'

export default async function addProduct(data: Product, id: string | null) {

  const validation = ProductSchema.safeParse(data)
  
  if (!validation.success) {
    return { success: false, error: 'Please fill all data correctly' }
  }

  try {
    const url = `https://dummyjson.com/products/${id ? id : 'add'}`
    const res = await fetch(url, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const x = await res.json()
    return { success: true, error: '' }
  } catch (error) {
    return { success: false, error: 'Add product failed, try again later' }
  }
}
