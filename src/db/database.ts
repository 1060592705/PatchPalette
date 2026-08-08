import Dexie, { type EntityTable } from 'dexie'

// ---- Data Models ----

export interface Category {
  id?: number
  name: string
  coverImage?: string // base64 or blob URL
  description?: string
  createdAt: Date
}

export interface TutorialLink {
  url: string
  platform: 'xiaohongshu' | 'douyin' | 'other'
}

export interface TutorialDimension {
  faceName: string   // e.g. "正面", "背面" — user-defined
  widthCm: number
  heightCm: number
  fabricId?: number  // assigned fabric from library
}

export interface Tutorial {
  id?: number
  categoryId: number
  title: string
  description?: string
  patternNumber?: string        // 纸样编号
  images: string[]              // base64 or blob URLs
  links: TutorialLink[]
  dimensions: TutorialDimension[]
  createdAt: Date
}

export interface Fabric {
  id?: number
  name: string
  image?: string          // base64 or blob URL
  widthCm: number
  lengthCm: number
  purchaseLink?: string
  tags: string[]           // e.g. ["红色", "波点", "棉布"]
  usedAreaCm2: number      // total area used across all patchwork designs
  createdAt: Date
}

// ---- Database ----

const db = new Dexie('PatchPaletteDB') as Dexie & {
  categories: EntityTable<Category, 'id'>
  tutorials: EntityTable<Tutorial, 'id'>
  fabrics: EntityTable<Fabric, 'id'>
}

db.version(1).stores({
  categories: '++id, name, createdAt',
  tutorials: '++id, categoryId, title, createdAt',
  fabrics: '++id, name, *tags, createdAt',
})

export { db }
