import { useState } from 'react'
import TabBar from './components/TabBar'
import InspirationPage from './pages/InspirationPage'
import FabricLibPage from './pages/FabricLibPage'
import PatchworkPage from './pages/PatchworkPage'

export type Tab = 'inspiration' | 'fabric' | 'patchwork'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inspiration')

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      <main className="flex-1 overflow-y-auto pb-2">
        {activeTab === 'inspiration' && <InspirationPage />}
        {activeTab === 'fabric' && <FabricLibPage />}
        {activeTab === 'patchwork' && <PatchworkPage />}
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
