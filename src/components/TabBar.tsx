import type { Tab } from '../App'

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'inspiration', label: '灵感库', icon: '📁' },
  { key: 'fabric', label: '布料库', icon: '🧵' },
  { key: 'patchwork', label: '拼布', icon: '✂️' },
]

interface Props {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <nav className="flex border-t border-gray-200 bg-white safe-area-bottom">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
            activeTab === tab.key
              ? 'text-indigo-600'
              : 'text-gray-500'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="mt-0.5">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
