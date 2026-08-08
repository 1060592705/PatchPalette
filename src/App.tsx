import { useState } from 'react'
import TabBar from './components/TabBar'
import InspirationPage from './pages/InspirationPage'
import CategoryDetailPage from './pages/CategoryDetailPage'
import FabricLibPage from './pages/FabricLibPage'
import PatchworkPage from './pages/PatchworkPage'

export type Tab = 'inspiration' | 'fabric' | 'patchwork'

type View =
  | { screen: 'tabs'; tab: Tab }
  | { screen: 'category-detail'; categoryId: number; categoryName: string }

function App() {
  const [view, setView] = useState<View>({ screen: 'tabs', tab: 'inspiration' })

  const navigateToTab = (tab: Tab) => setView({ screen: 'tabs', tab })
  const navigateToCategory = (categoryId: number, categoryName: string) =>
    setView({ screen: 'category-detail', categoryId, categoryName })
  const goBack = () => setView({ screen: 'tabs', tab: 'inspiration' })

  const isTabs = view.screen === 'tabs'

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      <main className="flex-1 overflow-y-auto">
        {view.screen === 'tabs' && view.tab === 'inspiration' && (
          <InspirationPage onCategoryClick={navigateToCategory} />
        )}
        {view.screen === 'tabs' && view.tab === 'fabric' && <FabricLibPage />}
        {view.screen === 'tabs' && view.tab === 'patchwork' && <PatchworkPage />}
        {view.screen === 'category-detail' && (
          <CategoryDetailPage
            categoryId={view.categoryId}
            categoryName={view.categoryName}
            onBack={goBack}
          />
        )}
      </main>
      {isTabs && <TabBar activeTab={view.tab} onTabChange={navigateToTab} />}
    </div>
  )
}

export default App
