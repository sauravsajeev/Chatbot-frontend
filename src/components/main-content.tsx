"use client"

import type React from "react"

import { useChat } from "../contexts/chat-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

import {
  Share,
  HelpCircle,
  Plus,
  Paperclip,
  Send,
  Sparkles,
  FileText,
  ShoppingCart,
  X,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { useState, useRef } from "react"

export function MainContent() {
  const { state, sendMessage, startChat, resetChat, addFile, removeFile, clearFiles, setModel } = useChat()
  const [inputValue, setInputValue] = useState("")
  const [showFileSection, setShowFileSection] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      if (!state.hasStartedChat) {
        startChat()
      }
      sendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewChat = () => {
    resetChat()
    setInputValue("")
    setShowFileSection(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      files.forEach((file) => {
        const attachedFile = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }
        addFile(attachedFile)
      })
      setShowFileSection(true)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      files.forEach((file) => {
        const attachedFile = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }
        addFile(attachedFile)
      })
      setShowFileSection(true)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files)
    if (files.length > 0) {
      files.forEach((file) => {
        const attachedFile = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }
        addFile(attachedFile)
      })
      setShowFileSection(true)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const toggleFileSection = () => {
    setShowFileSection(!showFileSection)
  }

  const suggestionCards = [
    {
      icon: Sparkles,
      title: "Give me a concise summary of this meeting transcript",
      color: "text-blue-500",
    },
    {
      icon: FileText,
      title: "Write a product description for a minimalist smartwatch",
      color: "text-purple-500",
    },
    {
      icon: ShoppingCart,
      title: "Provide a polite response to a customer asking for a refund",
      color: "text-blue-500",
    },
  ]

  const availableModels = ["ChatGPT 4", "Claude", "CoPilot", "Gemini", "DeepSeek"]

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {state.selectedModel}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {availableModels.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => setModel(model)}
                    className={state.selectedModel === model ? "bg-accent" : ""}
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground" onClick={handleNewChat}>
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!state.hasStartedChat ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">👋</div>
              <h1 className="text-2xl font-semibold mb-2">Hi Laurence!</h1>
              <p className="text-xl text-muted-foreground">What do you want to learn today?</p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl w-full">
              {suggestionCards.map((card, index) => (
                <Card
                  key={index}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-border"
                  onClick={() => {
                    setInputValue(card.title)
                    startChat()
                    sendMessage(card.title)
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`p-2 rounded-lg bg-secondary/20 ${card.color}`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{card.title}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto space-y-6">
              {state.messages.map((message) => (
                <div key={message.id} className="flex gap-4">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback
                      className={
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {message.sender === "user" ? "LC" : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {message.sender === "user" ? "You" : state.selectedModel}
                    </div>
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">{message.text}</div>
                  </div>
                </div>
              ))}

              {state.isTyping && (
                <div className="flex gap-4">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">{state.selectedModel}</div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="max-w-3xl mx-auto">
            {showFileSection && (
              <div className="mb-4 w-50 p-4 border border-border rounded-lg bg-background">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-foreground">Attached Files</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFiles}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Add <Plus className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                <div
                  className={`space-y-2 ${isDragOver ? "bg-blue-50 border-blue-200" : ""} transition-colors`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {state.attachedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-foreground">
                          {file.name.length > 6 ? file.name.slice(0, 6) + "..." : file.name}
                        </span>
                        <span className="text-[8px] text-muted-foreground">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div> */}
              </div>
            )}

            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                placeholder="Ask me a question..."
                className="pr-20 pl-12 py-3 text-base bg-input border-border"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                onClick={toggleFileSection}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              ChatGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
    </div>
  )
}
