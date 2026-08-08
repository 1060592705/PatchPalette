import { useState, useEffect } from 'react'
import { useCategories } from '../hooks/useCategories'
import { db, type Category } from '../db/database'
import CategoryForm from '../components/CategoryForm'

export default function InspirationPage() {
  const { categories, loading, add, update, remove } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [tutorialCounts, setTutorialCounts] = useState<Record<number, number>>({})

  // Load tutorial counts per category
  useEffect(() => {
    async function loadCounts() {
      const counts: Record<number, number> = {}
      for (const cat of categories) {
        if (cat.id != null) {
          counts[cat.id] = await db.tutorials.where('categoryId').equals(cat.id).count()
        }
      }
      setTutorialCounts(counts)
    }
    if (categories.length > 0) loadCounts()
  }, [categories])

  const handleSave = async (data: { name: string; description: string; coverImage: string }) => {
    if (editing?.id != null) {
      await update(editing.id, data)
    } else {
      await add(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`确定删除「${cat.name}」及其所有教程？`)) return
    if (cat.id != null) await remove(cat.id)
  }

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-40 text-gray-400 text-sm">
        加载中...
      </div>
    )
  }

  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">灵感库</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="text-sm text-indigo-600 font-medium"
        >
          + 新建分类
        </button>
      </header>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">📁</span>
          <p className="text-sm">还没有分类</p>
          <p className="text-xs mt-1">点击右上角创建第一个分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
            >
              {/* Cover */}
              <div
                className="w-full h-24 bg-gray-100 flex items-center justify-center text-3xl overflow-hidden"
                onClick={() => { setEditing(cat); setShowForm(true) }}
              >
                {cat.coverImage ? (
                  <img src={cat.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>📁</span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-medium text-gray-800 text-sm truncate">{cat.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">
                    {cat.id != null ? (tutorialCounts[cat.id] ?? 0) : 0} 个教程
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(cat) }}
                    className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <CategoryForm
          initial={
            editing
              ? { name: editing.name, description: editing.description ?? '', coverImage: editing.coverImage ?? '' }
              : undefined
          }
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
