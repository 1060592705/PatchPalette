import { useState, useEffect, useCallback } from 'react'
import { db, type Category } from '../db/database'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const all = await db.categories.orderBy('createdAt').reverse().toArray()
    setCategories(all)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (data: Omit<Category, 'id' | 'createdAt'>) => {
    const id = await db.categories.add({
      ...data,
      createdAt: new Date(),
    })
    await load()
    return id
  }

  const update = async (id: number, data: Partial<Omit<Category, 'id' | 'createdAt'>>) => {
    await db.categories.update(id, data)
    await load()
  }

  const remove = async (id: number) => {
    await db.categories.delete(id)
    // Also delete tutorials under this category
    await db.tutorials.where('categoryId').equals(id).delete()
    await load()
  }

  return { categories, loading, add, update, remove, reload: load }
}
