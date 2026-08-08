import { useState, useEffect, useCallback } from 'react'
import { db, type Tutorial } from '../db/database'

export function useTutorials(categoryId: number) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const all = await db.tutorials
      .where('categoryId')
      .equals(categoryId)
      .reverse()
      .sortBy('createdAt')
    setTutorials(all)
    setLoading(false)
  }, [categoryId])

  useEffect(() => { load() }, [load])

  const add = async (data: Omit<Tutorial, 'id' | 'createdAt'>) => {
    await db.tutorials.add({ ...data, createdAt: new Date() })
    await load()
  }

  const update = async (id: number, data: Partial<Omit<Tutorial, 'id' | 'createdAt'>>) => {
    await db.tutorials.update(id, data)
    await load()
  }

  const remove = async (id: number) => {
    await db.tutorials.delete(id)
    await load()
  }

  return { tutorials, loading, add, update, remove, reload: load }
}
