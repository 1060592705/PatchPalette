import { useState, useRef, type FormEvent } from 'react'
import { PRESET_TAGS } from '../hooks/useFabrics'

interface FabricFormData {
  name: string
  image: string
  widthCm: number
  lengthCm: number
  purchaseLink: string
  tags: string[]
}

interface Props {
  initial?: Partial<FabricFormData>
  onSave: (data: FabricFormData) => void
  onClose: () => void
}

export default function FabricForm({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [widthCm, setWidthCm] = useState(initial?.widthCm ? String(initial.widthCm) : '')
  const [lengthCm, setLengthCm] = useState(initial?.lengthCm ? String(initial.lengthCm) : '')
  const [purchaseLink, setPurchaseLink] = useState(initial?.purchaseLink ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [customTag, setCustomTag] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const addCustomTag = () => {
    const t = customTag.trim()
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t])
      setCustomTag('')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const w = parseFloat(widthCm) || 0
    const l = parseFloat(lengthCm) || 0
    onSave({ name: name.trim(), image, widthCm: w, lengthCm: l, purchaseLink: purchaseLink.trim(), tags })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-2xl p-5 pb-8 animate-slide-up max-h-[90dvh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {initial ? '编辑布料' : '添加布料'}
        </h2>

        {/* Image */}
        <div className="mb-4 flex flex-col items-center">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-28 h-28 rounded-xl bg-gray-100 flex items-center justify-center text-4xl overflow-hidden border border-gray-200"
          >
            {image ? (
              <img src={image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-300">🧵</span>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleImagePick} className="hidden" />
          <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 mt-1.5">
            {image ? '更换照片' : '拍照 / 选照片'}
          </button>
        </div>

        {/* Name */}
        <label className="block text-sm text-gray-600 mb-1">名称 *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：碎花棉布"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-indigo-400"
          autoFocus
        />

        {/* Dimensions */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">宽 (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              value={widthCm}
              onChange={(e) => setWidthCm(e.target.value)}
              placeholder="50"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">长 (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              value={lengthCm}
              onChange={(e) => setLengthCm(e.target.value)}
              placeholder="50"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Purchase link */}
        <label className="block text-sm text-gray-600 mb-1">购买链接（选填）</label>
        <input
          type="url"
          value={purchaseLink}
          onChange={(e) => setPurchaseLink(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-indigo-400"
        />

        {/* Tags */}
        <label className="block text-sm text-gray-600 mb-1">标签（可多选）</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`text-xs rounded-full px-2.5 py-1 border transition-colors ${
                tags.includes(tag)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {/* Custom tag */}
        <div className="flex gap-2 mb-4">
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
            placeholder="自定义标签..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-400"
          />
          <button type="button" onClick={addCustomTag} className="text-xs text-indigo-600 font-medium">添加</button>
        </div>

        {/* Buttons */}
        <button type="submit" disabled={!name.trim()} className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium text-sm disabled:opacity-40">
          保存
        </button>
        <button type="button" onClick={onClose} className="w-full text-gray-400 text-sm py-2 mt-1">取消</button>
      </form>
    </div>
  )
}
