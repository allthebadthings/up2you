import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, User } from 'lucide-react'
import { colors } from '../lib/design-tokens'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Kim from UP2YOU Jewelry. How can I help you today?",
      sender: 'agent',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate agent response after a delay
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! I'll get back to you shortly. In the meantime, feel free to browse our collection.",
        "That's a great question! Let me help you with that. You can also email us at contact@up2you.com for detailed assistance.",
        "I appreciate your interest! Our pieces are handcrafted with care. Check out our catalog to see what speaks to you.",
        "Great choice! Would you like to know more about our shipping options or return policy?"
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'agent',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, agentMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          style={{
            background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonDark})`
          }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {/* Pulse indicator */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-3rem)] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-neutral-700">
          {/* Header */}
          <div
            className="p-4 rounded-t-2xl flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonDark})`
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Kim</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r text-white'
                      : 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white'
                  }`}
                  style={
                    message.sender === 'user'
                      ? {
                          background: `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonDark})`
                        }
                      : undefined
                  }
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setInputValue("What's your return policy?")
                  setTimeout(() => handleSend(), 100)
                }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
              >
                Return Policy
              </button>
              <button
                onClick={() => {
                  setInputValue("How long does shipping take?")
                  setTimeout(() => handleSend(), 100)
                }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
              >
                Shipping Info
              </button>
              <button
                onClick={() => {
                  setInputValue("Tell me about custom orders")
                  setTimeout(() => handleSend(), 100)
                }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
              >
                Custom Orders
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: inputValue.trim()
                    ? `linear-gradient(135deg, ${colors.up2you.crimson}, ${colors.up2you.crimsonDark})`
                    : '#ccc'
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Typically replies within an hour
            </p>
          </div>
        </div>
      )}
    </>
  )
}
