import { useState, useRef, type FormEvent } from 'react'

interface CategoryFormData {
  name: string
  description: string
  coverImage: string // base64
}

interface Props {
  initial?: CategoryFormData
  onSave: (data: CategoryFormData) => void
  onClose: () => void
}

export default function CategoryForm({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCoverImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), description: description.trim(), coverImage })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-2xl p-5 pb-8 animate-slide-up"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {initial ? '编辑分类' : '新建分类'}
        </h2>

        {/* Cover image */}
        <div className="mb-4 flex flex-col items-center">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-4xl overflow-hidden border border-gray-200"
          >
            {coverImage ? (
              <img src={coverImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-300">📷</span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImagePick}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs text-indigo-600 mt-1.5"
          >
            {coverImage ? '更换封面' : '拍照 / 选封面'}
          </button>
        </div>

        {/* Name */}
        <label className="block text-sm text-gray-600 mb-1">名称 *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：布艺包包"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-indigo-400"
          autoFocus
        />

        {/* Description */}
        <label className="block text-sm text-gray-600 mb-1">描述（选填）</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="简单描述这个分类..."
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-indigo-400 resize-none"
        />

        {/* Buttons */}
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium text-sm disabled:opacity-40"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full text-gray-400 text-sm py-2 mt-1"
        >
          取消
        </button>
      </form>
    </div>
  )
}
