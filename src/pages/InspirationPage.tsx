import { useState } from 'react'

// Mock data — will be replaced by Dexie.js in Step 4
const mockCategories = [
  { id: 1, name: '布艺包包', count: 12, cover: '' },
  { id: 2, name: '石塑粘土', count: 5, cover: '' },
  { id: 3, name: '布偶', count: 8, cover: '' },
]

export default function InspirationPage() {
  const [categories] = useState(mockCategories)

  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">灵感库</h1>
        <button className="text-sm text-indigo-600 font-medium">+ 新建分类</button>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
          >
            <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-3xl">
              📁
            </div>
            <h3 className="font-medium text-gray-800">{cat.name}</h3>
            <p className="text-xs text-gray-400">{cat.count} 个教程</p>
          </div>
        ))}
      </div>
    </div>
  )
}
