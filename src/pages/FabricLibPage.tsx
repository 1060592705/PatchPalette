import { useState, useMemo } from 'react'
import { useFabrics } from '../hooks/useFabrics'
import { type Fabric } from '../db/database'
import FabricForm from '../components/FabricForm'

export default function FabricLibPage() {
  const { fabrics, loading, add, update, remove } = useFabrics()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Fabric | null>(null)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)

  // Collect all unique tags from fabrics for the filter bar
  const allTags = useMemo(() => {
    const set = new Set<string>()
    fabrics.forEach((f) => f.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [fabrics])

  // Filter + search
  const filtered = useMemo(() => {
    let list = fabrics
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((f) => f.name.toLowerCase().includes(q))
    }
    if (filterTag) {
      list = list.filter((f) => f.tags.includes(filterTag))
    }
    return list
  }, [fabrics, search, filterTag])

  const handleSave = async (data: {
    name: string; image: string; widthCm: number; lengthCm: number
    purchaseLink: string; tags: string[]
  }) => {
    if (editing?.id != null) {
      await update(editing.id, data)
    } else {
      await add(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (f: Fabric) => {
    if (!window.confirm(`确定删除「${f.name}」？`)) return
    if (f.id != null) await remove(f.id)
  }

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-40 text-gray-400 text-sm">加载中...</div>
    )
  }

  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold text-gray-800">布料库</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="text-sm text-indigo-600 font-medium"
        >
          + 添加布料
        </button>
      </header>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 搜索布料..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-indigo-400"
      />

      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterTag(null)}
            className={`text-xs rounded-full px-3 py-1 whitespace-nowrap border transition-colors ${
              filterTag === null
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`text-xs rounded-full px-3 py-1 whitespace-nowrap border transition-colors ${
                filterTag === tag
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Fabric list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">🧵</span>
          <p className="text-sm">{fabrics.length === 0 ? '还没有布料' : '没有匹配的布料'}</p>
          <p className="text-xs mt-1">{fabrics.length === 0 ? '点击右上角添加第一块布料' : '换个搜索词或标签试试'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-gray-100 group"
              onClick={() => { setEditing(f); setShowForm(true) }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                {f.image ? (
                  <img src={f.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>🧵</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 text-sm truncate">{f.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {f.widthCm > 0 && f.lengthCm > 0
                    ? `${f.widthCm} × ${f.lengthCm} cm`
                    : '未设置尺寸'}
                  {f.usedAreaCm2 > 0 && (
                    <span className="text-gray-400 ml-1">
                      · 已用 {f.usedAreaCm2}cm²
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {f.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-gray-50 text-gray-400 rounded-full px-1.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(f) }}
                className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1 shrink-0"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <FabricForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
