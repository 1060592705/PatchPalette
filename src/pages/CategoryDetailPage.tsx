import { useState } from 'react'
import { useTutorials } from '../hooks/useTutorials'
import { type Tutorial } from '../db/database'
import TutorialForm from '../components/TutorialForm'

interface Props {
  categoryId: number
  categoryName: string
  onBack: () => void
}

export default function CategoryDetailPage({ categoryId, categoryName, onBack }: Props) {
  const { tutorials, loading, add, update, remove } = useTutorials(categoryId)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Tutorial | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleSave = async (data: {
    title: string; description: string; patternNumber: string
    images: string[]; links: Tutorial['links']; dimensions: Tutorial['dimensions']
  }) => {
    if (editing?.id != null) {
      await update(editing.id, data)
    } else {
      await add({ ...data, categoryId, images: data.images, links: data.links, dimensions: data.dimensions })
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async (t: Tutorial) => {
    if (!window.confirm(`确定删除「${t.title}」？`)) return
    if (t.id != null) await remove(t.id)
  }

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener')
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-40 text-gray-400 text-sm">加载中...</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header */}
      <header className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="text-gray-500 text-lg shrink-0">←</button>
        <h1 className="text-lg font-semibold text-gray-800 truncate flex-1">{categoryName}</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="text-sm text-indigo-600 font-medium shrink-0"
        >
          + 添加
        </button>
      </header>

      {tutorials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">📖</span>
          <p className="text-sm">还没有教程</p>
          <p className="text-xs mt-1">点击右上角添加第一个教程</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tutorials.map((t) => {
            const isExpanded = expandedId === t.id
            return (
              <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Summary bar — tap to expand */}
                <button
                  className="w-full p-3 flex items-center gap-3 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : (t.id ?? null))}
                >
                  {/* Thumb */}
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0 overflow-hidden">
                    {t.images[0] ? (
                      <img src={t.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>📖</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{t.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.links.length > 0 && `🔗 ${t.links.length} 个链接`}
                      {t.links.length > 0 && t.dimensions.length > 0 && ' · '}
                      {t.dimensions.length > 0 && `📏 ${t.dimensions.length} 个面`}
                      {t.patternNumber && (
                        <span className="ml-1">· 纸样: {t.patternNumber}</span>
                      )}
                    </p>
                  </div>
                  <span className="text-gray-300 text-xs">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-gray-50 pt-3">
                    {t.description && (
                      <p className="text-sm text-gray-600 mb-3">{t.description}</p>
                    )}

                    {/* Images */}
                    {t.images.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                        {t.images.map((img, i) => (
                          <img key={i} src={img} alt="" className="w-24 h-24 rounded-lg object-cover border border-gray-100 shrink-0" />
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    {t.links.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">教程链接：</p>
                        {t.links.map((link, i) => (
                          <button
                            key={i}
                            onClick={() => openLink(link.url)}
                            className="block w-full text-left text-xs text-indigo-600 py-1 truncate underline"
                          >
                            {link.platform === 'xiaohongshu' ? '📕 小红书' : link.platform === 'douyin' ? '🎵 抖音' : '🔗 其他'}
                            {' → 打开'}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Dimensions */}
                    {t.dimensions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">包包尺寸：</p>
                        <div className="space-y-1">
                          {t.dimensions.map((d, i) => (
                            <div key={i} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1 flex justify-between">
                              <span>{d.faceName}</span>
                              <span>{d.widthCm} × {d.heightCm} cm</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => { setEditing(t); setShowForm(true) }}
                        className="flex-1 text-xs text-indigo-600 py-1.5 rounded-lg bg-indigo-50"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        className="flex-1 text-xs text-red-500 py-1.5 rounded-lg bg-red-50"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <TutorialForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
