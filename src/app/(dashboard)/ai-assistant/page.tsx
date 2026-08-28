'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Bot, Send, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'Which vendors are high risk?',
  'What needs immediate attention?',
  'Summarize my vendor portfolio',
  'Which vendors have expiring contracts?',
  'What evaluations are overdue?',
  'Are there any critical risk findings?',
]

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

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
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.error || 'Sorry, something went wrong.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to get a response. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-900">AI Assistant</h1>
        <p className="text-sm text-slate-500">Ask questions about your vendor portfolio and risk data</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-sm text-slate-500 mb-6">Ask me anything about your vendors, risks, and evaluations.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_PROMPTS.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-sky-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-sky-500' : 'bg-slate-800'}`}>
              {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
            </div>
            <Card className={`max-w-[80%] ${msg.role === 'user' ? 'bg-sky-50 border-sky-200' : ''}`}>
              <CardContent className="py-3 px-4">
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Card>
              <CardContent className="py-3 px-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 pt-4">
        {messages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_PROMPTS.slice(0, 3).map(prompt => (
              <button key={prompt} onClick={() => sendMessage(prompt)} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your vendors..."
            className="resize-none min-h-0 h-10 py-2"
            rows={1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
          />
          <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Powered by Google Gemini · Data from your Supabase database</p>
      </div>
    </div>
  )
}
