export default function PatchworkPage() {
  return (
    <div className="p-4">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">拼布</h1>
        <button className="text-sm text-indigo-600 font-medium">+ 新建拼布</button>
      </header>

      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-5xl mb-3">✂️</span>
        <p className="text-sm">还没有拼布方案</p>
        <p className="text-xs mt-1">点击上方按钮创建第一个拼布</p>
      </div>
    </div>
  )
}
