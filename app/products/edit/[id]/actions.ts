'use server'

import { z } from 'zod'

const schema = z.object({
  id: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  price: z.number().positive(),
  brand: z.string().min(1),
  category: z.string().min(1),
  discountPercentage: z.number().positive(),
  rating: z.number().min(1).max(5),
  stock: z.number().int().positive()
})

export default async function editProduct(id: number, formData: FormData) {
  const json = {
    id: id,
    title: formData.get('title'),
    description: formData.get('description'),
    price: Number(formData.get('price')),
    brand: formData.get('brand'),
    category: formData.get('category'),
    discountPercentage: Number(formData.get('discountPercentage')),
    rating: Number(formData.get('rating')),
    stock: Number(formData.get('stock')),
  }

  const validation = schema.safeParse(json)
  
  if (!validation.success) {
    return { success: false, error: 'Please fill all input correctly' }
  }

  try {
    const res = await fetch('https://dummyjson.com/products/add', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    })
    const x = await res.json()
    return { success: true, error: '' }
  } catch (error) {
    return { success: false, error: 'Edit product failed' }
  }
}
