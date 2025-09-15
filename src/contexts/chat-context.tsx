"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export interface Message {
  id: string
  text: string
  sender: "user" | "assistant"
  timestamp: Date
}

export interface SavedChat {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}

export interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
}

interface ChatState {
  messages: Message[]
  isTyping: boolean
  hasStartedChat: boolean
  sidebarCollapsed: boolean
  savedChats: SavedChat[]
  currentChatId: string | null
  searchQuery: string
  attachedFiles: AttachedFile[]
  selectedModel: string // Added selectedModel to state
}

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "START_CHAT" }
  | { type: "RESET_CHAT" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SAVE_CHAT" }
  | { type: "LOAD_CHAT"; payload: string }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "ADD_FILE"; payload: AttachedFile }
  | { type: "REMOVE_FILE"; payload: string }
  | { type: "CLEAR_FILES" }
  | { type: "SET_MODEL"; payload: string } // Added SET_MODEL action

const initialState: ChatState = {
  messages: [],
  isTyping: false,
  hasStartedChat: false,
  sidebarCollapsed: false,
  savedChats: [
    {
      id: "1",
      title: "Write a shakespearean sonnet about a cat that...",
      messages: [],
      lastUpdated: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "6 Great commercials were directed by Orson...",
      messages: [],
      lastUpdated: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      title: "Renewable Energy Trends",
      messages: [],
      lastUpdated: new Date(Date.now() - 259200000),
    },
    {
      id: "4",
      title: "Describe a medieval jousting tournament after...",
      messages: [],
      lastUpdated: new Date(Date.now() - 345600000),
    },
    {
      id: "5",
      title: "What would a job interview be like if aliens wer...",
      messages: [],
      lastUpdated: new Date(Date.now() - 432000000),
    },
    {
      id: "6",
      title: "Generate a rap battle between a sentient toaste...",
      messages: [],
      lastUpdated: new Date(Date.now() - 518400000),
    },
    {
      id: "7",
      title: "What if a person was actually a holographic and...",
      messages: [],
      lastUpdated: new Date(Date.now() - 604800000),
    },
    {
      id: "8",
      title: "Pitch a reality TV show where ghosts haunt influ...",
      messages: [],
      lastUpdated: new Date(Date.now() - 691200000),
    },
  ],
  currentChatId: null,
  searchQuery: "",
  attachedFiles: [],
  selectedModel: "ChatGPT 4", // Added default selected model
}

const generateChatTitle = (firstMessage: string): string => {
  if (firstMessage.length <= 50) return firstMessage
  return firstMessage.substring(0, 47) + "..."
}

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }
    case "SET_TYPING":
      return {
        ...state,
        isTyping: action.payload,
      }
    case "START_CHAT":
      return {
        ...state,
        hasStartedChat: true,
      }
    case "RESET_CHAT": {
      let newSavedChats = state.savedChats
      if (state.messages.length > 0) {
        const chatTitle = generateChatTitle(state.messages[0]?.text || "New Chat")
        const newChat: SavedChat = {
          id: state.currentChatId || Date.now().toString(),
          title: chatTitle,
          messages: state.messages,
          lastUpdated: new Date(),
        }

        const existingIndex = state.savedChats.findIndex((chat) => chat.id === state.currentChatId)
        if (existingIndex >= 0) {
          newSavedChats = [...state.savedChats]
          newSavedChats[existingIndex] = newChat
        } else {
          newSavedChats = [newChat, ...state.savedChats]
        }
      }

      return {
        ...initialState,
        savedChats: newSavedChats,
        sidebarCollapsed: state.sidebarCollapsed,
        searchQuery: state.searchQuery,
        attachedFiles: [],
      }
    }
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      }
    case "SAVE_CHAT": {
      if (state.messages.length === 0) return state

      const chatTitle = generateChatTitle(state.messages[0]?.text || "New Chat")
      const savedChat: SavedChat = {
        id: state.currentChatId || Date.now().toString(),
        title: chatTitle,
        messages: state.messages,
        lastUpdated: new Date(),
      }

      const existingIndex = state.savedChats.findIndex((chat) => chat.id === state.currentChatId)
      let updatedSavedChats

      if (existingIndex >= 0) {
        updatedSavedChats = [...state.savedChats]
        updatedSavedChats[existingIndex] = savedChat
      } else {
        updatedSavedChats = [savedChat, ...state.savedChats]
      }

      return {
        ...state,
        savedChats: updatedSavedChats,
        currentChatId: savedChat.id,
      }
    }
    case "LOAD_CHAT": {
      const chatToLoad = state.savedChats.find((chat) => chat.id === action.payload)
      if (!chatToLoad) return state

      return {
        ...state,
        messages: chatToLoad.messages,
        hasStartedChat: chatToLoad.messages.length > 0,
        currentChatId: chatToLoad.id,
        isTyping: false,
      }
    }
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      }
    case "ADD_FILE":
      return {
        ...state,
        attachedFiles: [...state.attachedFiles, action.payload],
      }
    case "REMOVE_FILE":
      return {
        ...state,
        attachedFiles: state.attachedFiles.filter((file) => file.id !== action.payload),
      }
    case "CLEAR_FILES":
      return {
        ...state,
        attachedFiles: [],
      }
    case "SET_MODEL": // Added SET_MODEL case
      return {
        ...state,
        selectedModel: action.payload,
      }
    default:
      return state
  }
}

interface ChatContextType {
  state: ChatState
  sendMessage: (text: string) => void
  startChat: () => void
  resetChat: () => void
  toggleSidebar: () => void
  saveChat: () => void
  loadChat: (chatId: string) => void
  setSearchQuery: (query: string) => void
  getFilteredChats: () => SavedChat[]
  addFile: (file: AttachedFile) => void
  removeFile: (fileId: string) => void
  clearFiles: () => void
  setModel: (model: string) => void // Added setModel function
}

const assistantResponses = [
  "That's an interesting question! Let me help you with that.\n\nWhen approaching this topic, it's important to consider multiple perspectives and factors that might influence the outcome. I'll break this down into key components to give you a comprehensive understanding.\n\nBased on current knowledge and best practices, here's what I would recommend for your specific situation.",
  "I understand what you're asking. Here's what I think about this matter.\n\nThis is actually a complex topic that involves several interconnected elements. From my analysis, there are both immediate considerations and long-term implications to think about.\n\nLet me walk you through the most important aspects and provide some actionable insights that you can apply right away.",
  "Great point! I'd be happy to elaborate on that topic in detail.\n\nThis subject has evolved significantly over time, and there are some fascinating developments worth exploring. The key is understanding how different factors work together to create the bigger picture.\n\nHere's a structured approach to help you navigate this effectively and make informed decisions moving forward.",
  "Thanks for sharing that with me. Here's my perspective on this situation.\n\nWhat you've described touches on several important principles that are worth examining more closely. I think there are some valuable lessons we can extract from this scenario.\n\nLet me provide you with a comprehensive analysis that addresses both the immediate concerns and the broader implications for your goals.",
]

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const sendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }
    dispatch({ type: "ADD_MESSAGE", payload: userMessage })

    if (state.messages.length === 0 && !state.currentChatId) {
      const newChatId = Date.now().toString()
      dispatch({ type: "LOAD_CHAT", payload: newChatId })
    }

    dispatch({ type: "SET_TYPING", payload: true })

    setTimeout(
      () => {
        const randomResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)]
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: "assistant",
          timestamp: new Date(),
        }
        dispatch({ type: "SET_TYPING", payload: false })
        dispatch({ type: "ADD_MESSAGE", payload: assistantMessage })
        setTimeout(() => dispatch({ type: "SAVE_CHAT" }), 100)
      },
      1000 + Math.random() * 2000,
    )
  }

  const startChat = () => {
    dispatch({ type: "START_CHAT" })
  }

  const resetChat = () => {
    dispatch({ type: "RESET_CHAT" })
  }

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" })
  }

  const saveChat = () => {
    dispatch({ type: "SAVE_CHAT" })
  }

  const loadChat = (chatId: string) => {
    dispatch({ type: "LOAD_CHAT", payload: chatId })
  }

  const setSearchQuery = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })
  }

  const getFilteredChats = (): SavedChat[] => {
    if (!state.searchQuery.trim()) {
      return state.savedChats
    }

    return state.savedChats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        chat.messages.some((message) => message.text.toLowerCase().includes(state.searchQuery.toLowerCase())),
    )
  }

  const addFile = (file: AttachedFile) => {
    dispatch({ type: "ADD_FILE", payload: file })
  }

  const removeFile = (fileId: string) => {
    dispatch({ type: "REMOVE_FILE", payload: fileId })
  }

  const clearFiles = () => {
    dispatch({ type: "CLEAR_FILES" })
  }

  const setModel = (model: string) => {
    // Added setModel function
    dispatch({ type: "SET_MODEL", payload: model })
  }

  return (
    <ChatContext.Provider
      value={{
        state,
        sendMessage,
        startChat,
        resetChat,
        toggleSidebar,
        saveChat,
        loadChat,
        setSearchQuery,
        getFilteredChats,
        addFile,
        removeFile,
        clearFiles,
        setModel, // Added setModel to context value
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
