'use client'
import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'Can I afford a car?',
  'How do I start investing?',
  'How long to reach my goal?',
  'What should I do first?',
  'Explain my investment picks',
  'How can I save more?',
]

export default function PlanChat({ planId }: { planId: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: "Hi! I've read your full financial plan. Ask me anything — whether you can afford something, how to hit your goal faster, or what to do first. I'm here to help." }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text?: string) {
    const msg = (text || input).trim()
    if (!msg || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/chat-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) throw new Error('Failed')

      // Stream response token by token
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let assistantMsg = ''
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantMsg += decoder.decode(value)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantMsg }
          return updated
        })
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Try again in a moment." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--accent)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(200,240,96,0.4)',
          fontSize: 22, transition: 'transform 0.2s',
        }}
        title="Ask AI about your plan"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 999,
          width: 360, maxWidth: 'calc(100vw - 32px)',
          height: 520, maxHeight: 'calc(100vh - 120px)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(200,240,96,0.15)', border: '1px solid rgba(200,240,96,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>&#129302;</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Ask about your plan</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Powered by DeepSeek AI</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg)',
                  color: m.role === 'user' ? '#09090b' : 'var(--body)',
                  border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  fontSize: 13, lineHeight: 1.6,
                }}>
                  {m.content || <span style={{ opacity: 0.4 }}>&#9679;&#9679;&#9679;</span>}
                </div>
              </div>
            ))}

            {/* Suggestions (only when no user messages yet) */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    padding: '6px 12px', background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 20, fontSize: 12, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', fontSize: 16, letterSpacing: 2 }}>
                  <span style={{ opacity: 0.5 }}>&#9679;&#9679;&#9679;</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, background: 'var(--bg)' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask anything about your plan..."
              disabled={loading}
              style={{
                flex: 1, padding: '10px 14px', background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 10,
                color: 'var(--body)', fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                padding: '10px 16px', background: input.trim() && !loading ? 'var(--accent)' : 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 10,
                color: input.trim() && !loading ? '#09090b' : 'var(--muted)',
                fontSize: 14, cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  )
}
