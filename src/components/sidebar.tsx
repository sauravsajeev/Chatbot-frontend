"use client"

import type React from "react"
import { useState } from "react"

import { useChat } from "../contexts/chat-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Search, MessageSquare, Library, History, Compass, Sparkles, ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"
export function Sidebar() {
  const { state, toggleSidebar, loadChat, setSearchQuery, getFilteredChats } = useChat()
  const [searchValue, setSearchValue] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    setSearchQuery(value)
  }

  const handleChatClick = (chatId: string) => {
    loadChat(chatId)
  }

  const filteredChats = getFilteredChats()

  return (
    <div
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        state.sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        {!state.sidebarCollapsed && (
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleSidebar}
          >
            <div className="w-8 h-8  rounded-lg flex items-center justify-center">
              <img className="w-8 h-8" src="/logo.png" />
              {/* <MessageSquare  /> */}
            </div>
            <span className="font-semibold text-lg">Intelliq</span>
          </div>
        )}
        {state.sidebarCollapsed && (
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={toggleSidebar}
            >
               <img className="w-8 h-8" src="/logo.png" />
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      {!state.sidebarCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for chats..."
              className="pl-10 bg-background border-border"
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 px-2">
        <nav className="space-y-1">
          <NavItem icon={MessageSquare} label="Home" shortcut="⌘H" collapsed={state.sidebarCollapsed} active />
          <NavItem icon={Library} label="Library" shortcut="⌘T" collapsed={state.sidebarCollapsed} />
          <NavItem icon={History} label="History" shortcut="⌘G" collapsed={state.sidebarCollapsed} />
          <NavItem icon={Compass} label="Explore" shortcut="⌘L" collapsed={state.sidebarCollapsed} />
        </nav>

        {/* Recent Chats */}
        {!state.sidebarCollapsed && (
          <div className="mt-8">
            <h3 className="px-2 mb-2 text-sm font-medium text-muted-foreground">Recent Chats</h3>
            <div className="space-y-1">
              {filteredChats.slice(0, 8).map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "px-2 py-2 text-sm hover:bg-accent/10 rounded-md cursor-pointer truncate transition-colors",
                    state.currentChatId === chat.id ? "bg-accent/20 text-foreground" : "text-foreground",
                  )}
                  onClick={() => handleChatClick(chat.id)}
                >
                  {chat.title}
                </div>
              ))}
              {filteredChats.length === 0 && state.searchQuery && (
                <div className="px-2 py-2 text-sm text-muted-foreground">No chats found</div>
              )}
              <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
                View All →
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        {!state.sidebarCollapsed && (
          <>
            {/* Try Pro */}
            <div className="mb-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Try Pro!</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Upgrade for smarter AI and more...</p>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">LC</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Lawrence Cruz</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </>
        )}
        {state.sidebarCollapsed && (
          <div className="flex justify-center">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">LC</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ElementType
  label: string
  shortcut?: string
  collapsed: boolean
  active?: boolean
}

function NavItem({ icon: Icon, label, shortcut, collapsed, active }: NavItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors",
        active ? (collapsed ? "bg-transparent text-blue-600": "bg-blue-600 text-primary-foreground" ): "hover:bg-accent/10 text-foreground",
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-sm font-medium">{label}</span>
          {shortcut && (
            <span className={cn("text-xs", active ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {shortcut}
            </span>
          )}
        </>
      )}
    </div>
  )
}
