import { useState, useEffect, useRef, type FormEvent } from 'react'
import { db, type TutorialLink, type TutorialDimension, type Fabric } from '../db/database'

interface TutorialFormData {
  title: string
  description: string
  patternNumber: string
  images: string[]
  links: TutorialLink[]
  dimensions: TutorialDimension[]
}

interface Props {
  initial?: Partial<TutorialFormData & { images: string[]; links: TutorialLink[]; dimensions: TutorialDimension[] }>
  onSave: (data: TutorialFormData) => void
  onClose: () => void
}

export default function TutorialForm({ initial, onSave, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [patternNumber, setPatternNumber] = useState(initial?.patternNumber ?? '')
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [links, setLinks] = useState<TutorialLink[]>(initial?.links ?? [])
  const [dimensions, setDimensions] = useState<TutorialDimension[]>(initial?.dimensions ?? [])
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    db.fabrics.orderBy('createdAt').reverse().toArray().then(setFabrics)
  }, [])

  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImages((prev) => [...prev, reader.result as string])
    reader.readAsDataURL(file)
  }

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i))

  const addLink = () => setLinks((prev) => [...prev, { url: '', platform: 'other' }])
  const updateLink = (i: number, data: Partial<TutorialLink>) =>
    setLinks((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...data } : l)))
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i))

  const addDimension = () =>
    setDimensions((prev) => [...prev, { faceName: '', widthCm: 0, heightCm: 0 }])
  const updateDimension = (i: number, data: Partial<TutorialDimension>) =>
    setDimensions((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...data } : d)))
  const removeDimension = (i: number) =>
    setDimensions((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      patternNumber: patternNumber.trim(),
      images,
      links: links.filter((l) => l.url.trim()),
      dimensions: dimensions.filter((d) => d.faceName.trim() && d.widthCm > 0 && d.heightCm > 0),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-2xl p-5 pb-8 animate-slide-up max-h-[90dvh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {initial ? '编辑教程' : '添加教程'}
        </h2>

        {/* Title */}
        <label className="block text-sm text-gray-600 mb-1">标题 *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例如：托特包教程"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-indigo-400"
          autoFocus
        />

        {/* Description */}
        <label className="block text-sm text-gray-600 mb-1">描述（选填）</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="简单描述..."
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-indigo-400 resize-none"
        />

        {/* Pattern number */}
        <label className="block text-sm text-gray-600 mb-1">纸样编号（选填）</label>
        <input
          value={patternNumber}
          onChange={(e) => setPatternNumber(e.target.value)}
          placeholder="例如：BP-001"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-indigo-400"
        />

        {/* ---- Images ---- */}
        <label className="block text-sm text-gray-600 mb-1">参考图片</label>
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <div key={i} className="relative shrink-0">
              <img src={img} alt="" className="w-20 h-20 rounded-lg object-cover border border-gray-100" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 shrink-0 text-2xl"
          >
            +
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={addImage} className="hidden" />

        {/* ---- Links ---- */}
        <div className="flex items-center justify-between mt-4 mb-1">
          <span className="text-sm text-gray-600">教程链接</span>
          <button type="button" onClick={addLink} className="text-xs text-indigo-600">+ 添加链接</button>
        </div>
        {links.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <select
              value={link.platform}
              onChange={(e) => updateLink(i, { platform: e.target.value as TutorialLink['platform'] })}
              className="border border-gray-200 rounded-lg px-2 py-2 text-xs w-20 shrink-0 focus:outline-none"
            >
              <option value="xiaohongshu">小红书</option>
              <option value="douyin">抖音</option>
              <option value="other">其他</option>
            </select>
            <input
              value={link.url}
              onChange={(e) => updateLink(i, { url: e.target.value })}
              placeholder="粘贴链接..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-400"
            />
            <button type="button" onClick={() => removeLink(i)} className="text-red-400 text-xs shrink-0">删除</button>
          </div>
        ))}

        {/* ---- Dimensions ---- */}
        <div className="flex items-center justify-between mt-4 mb-1">
          <span className="text-sm text-gray-600">包包各面尺寸</span>
          <button type="button" onClick={addDimension} className="text-xs text-indigo-600">+ 添加面</button>
        </div>
        {dimensions.map((dim, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2">
            <div className="flex gap-2 mb-2 items-center">
              <input
                value={dim.faceName}
                onChange={(e) => updateDimension(i, { faceName: e.target.value })}
                placeholder="面名称（如：正面）"
                className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-400"
              />
              <button type="button" onClick={() => removeDimension(i)} className="text-red-400 text-xs shrink-0">删除</button>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                inputMode="decimal"
                value={dim.widthCm || ''}
                onChange={(e) => updateDimension(i, { widthCm: parseFloat(e.target.value) || 0 })}
                placeholder="宽 cm"
                className="w-1/2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-400"
              />
              <input
                type="number"
                inputMode="decimal"
                value={dim.heightCm || ''}
                onChange={(e) => updateDimension(i, { heightCm: parseFloat(e.target.value) || 0 })}
                placeholder="高 cm"
                className="w-1/2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-indigo-400"
              />
            </div>
            {/* Fabric picker for this face */}
            {fabrics.length > 0 && (
              <select
                value={dim.fabricId ?? ''}
                onChange={(e) => updateDimension(i, { fabricId: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none"
              >
                <option value="">（可选）选布料...</option>
                {fabrics.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.widthCm}×{f.lengthCm}cm)
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {/* Submit */}
        <button type="submit" disabled={!title.trim()} className="w-full bg-indigo-600 text-white rounded-lg py-2.5 font-medium text-sm mt-3 disabled:opacity-40">
          保存
        </button>
        <button type="button" onClick={onClose} className="w-full text-gray-400 text-sm py-2 mt-1">取消</button>
      </form>
    </div>
  )
}
