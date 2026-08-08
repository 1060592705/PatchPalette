import { useState, useEffect, useCallback } from 'react'
import { db, type Fabric } from '../db/database'

export const PRESET_TAGS = [
  // 颜色
  '红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '白色', '黑色', '灰色', '棕色',
  // 图案
  '碎花', '波点', '格子', '条纹', '纯色', '印花', '刺绣',
  // 材质
  '棉布', '帆布', '牛仔', '丝绸', '亚麻', '毛呢', '皮革', '蕾丝', '纱',
]

export function useFabrics() {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const all = await db.fabrics.orderBy('createdAt').reverse().toArray()
    setFabrics(all)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = async (data: Omit<Fabric, 'id' | 'usedAreaCm2' | 'createdAt'>) => {
    const id = await db.fabrics.add({
      ...data,
      usedAreaCm2: 0,
      createdAt: new Date(),
    })
    await load()
    return id
  }

  const update = async (id: number, data: Partial<Omit<Fabric, 'id' | 'createdAt'>>) => {
    await db.fabrics.update(id, data)
    await load()
  }

  const remove = async (id: number) => {
    await db.fabrics.delete(id)
    await load()
  }

  return { fabrics, loading, add, update, remove, reload: load }
}
