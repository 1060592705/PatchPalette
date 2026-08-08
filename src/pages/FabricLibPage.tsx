export default function FabricLibPage() {
  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">布料库</h1>
        <button className="text-sm text-indigo-600 font-medium">+ 添加布料</button>
      </header>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {['全部', '红色', '棉布', '碎花', '帆布'].map((tag) => (
          <span
            key={tag}
            className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600 whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {[
          { name: '碎花棉布', size: '50×50cm', tags: '红色 · 碎花 · 棉布' },
          { name: '牛仔布', size: '100×80cm', tags: '蓝色 · 牛仔 · 中厚' },
          { name: '红色波点布', size: '60×45cm', tags: '红色 · 波点 · 棉布' },
        ].map((fabric) => (
          <div
            key={fabric.name}
            className="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-gray-100"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl shrink-0">
              🧵
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 text-sm">{fabric.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{fabric.size}</p>
              <p className="text-xs text-gray-400 mt-0.5">{fabric.tags}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
