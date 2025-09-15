"use client"

import { ChatProvider } from "./contexts/chat-context"
import { Sidebar } from "./components/sidebar"
import { MainContent } from "./components/main-content"

function App() {

  return (
    <>
      <ChatProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <MainContent />
      </div>
    </ChatProvider>
    </>
  )
}

export default App
