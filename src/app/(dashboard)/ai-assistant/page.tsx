'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Send, User, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'Which accounts are declining this quarter?',
  'Where is revenue most at risk?',
  'Which customers haven\'t ordered in 60 days?',
  'What should my team follow up on this week?',
  'Which accounts have the most revenue exposure?',
  'Show me accounts with shrinking order volumes',
]

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(message: string) {
    if (!message.trim() || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || data.error || 'Something went wrong. Try again.',
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to reach VendorLens AI. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px-48px)] max-w-3xl">

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)' }}>
            <Bot className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Ask VendorLens</h1>
        </div>
        <p className="text-sm text-slate-500 ml-11">Ask in plain language. The answer comes back with the numbers it came from.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {messages.length === 0 && (
          <div className="py-8">
            <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '1px solid #bae6fd' }}>
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#0891b2' }} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">VendorLens reads your account data</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    It knows every account, every risk flag, every document and evaluation in your workspace. Ask it what you need to know — it responds with the figures behind every statement.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-3">Suggested questions</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-xs px-4 py-3 rounded-xl border text-slate-600 hover:text-slate-900 transition-all duration-150 hover:shadow-sm"
                  style={{ borderColor: '#e2e8f0', background: 'white' }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={msg.role === 'user'
                ? { background: '#f1f5f9', border: '1px solid #e2e8f0' }
                : { background: 'linear-gradient(135deg, #0369a1, #0891b2)' }
              }
            >
              {msg.role === 'user'
                ? <User className="h-4 w-4 text-slate-500" />
                : <Bot className="h-4 w-4 text-white" />
              }
            </div>
            <div
              className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap"
              style={msg.role === 'user'
                ? { background: '#f1f5f9', borderRadius: '16px 4px 16px 16px' }
                : { background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px 16px 16px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)' }}>
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="rounded-2xl px-4 py-3 flex items-center gap-1" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
        {messages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_PROMPTS.slice(0, 3).map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="text-xs px-3 py-1.5 rounded-lg border text-slate-500 hover:text-slate-800 transition-colors"
                style={{ borderColor: '#e2e8f0', background: 'white' }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your accounts, risk exposure, or what to do next…"
            className="resize-none min-h-0 h-10 py-2 text-sm"
            rows={1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="shrink-0"
            style={{ background: 'linear-gradient(135deg, #0369a1, #0891b2)' }}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">VendorLens AI reads your workspace data and responds with figures, not generalities.</p>
      </div>
    </div>
  )
}
