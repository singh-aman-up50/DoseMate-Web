import React, { useState, useRef, useEffect } from 'react'
import { Box, IconButton, Paper, TextField, Typography, Avatar, CircularProgress } from '@mui/material'
import { ChatBubble, Close, Send } from '@mui/icons-material'
import { api } from '../api/axios'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (open) {
      // focus input when opened
      const el = document.getElementById('chat-input')
      if (el) el.focus()
    }
  }, [open])

  useEffect(() => {
    // scroll to bottom on new message
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      // POST to backend AI endpoint. Expected response: { reply: '...' }
      const res = await api.post('/ai/chat', { message: userMsg.text })
      const replyText = res.data?.reply || 'Sorry, no reply available.'
      setMessages((m) => [...m, { role: 'assistant', text: replyText }])
    } catch (err) {
      console.error('AI chat error', err)
      setMessages((m) => [...m, { role: 'assistant', text: 'AI service is unavailable right now.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1500 }}>
        {!open && (
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ background: 'linear-gradient(135deg,var(--brand),var(--brand-light))', color: '#fff', width: 64, height: 64, boxShadow: '0 8px 30px rgba(11,61,145,0.24)' }}
            aria-label="Open AI Chat"
          >
            <ChatBubble />
          </IconButton>
        )}

        {open && (
          <Paper elevation={24} sx={{ width: { xs: 320, sm: 420 }, height: { xs: 420, sm: 520 }, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.25, background: 'linear-gradient(90deg,var(--brand),var(--brand-light))', color: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)' }}>AI</Avatar>
                <Typography sx={{ fontWeight: 700 }}>DoseMate AI</Typography>
              </Box>
              <Box>
                <IconButton onClick={() => setOpen(false)} sx={{ color: '#fff' }} aria-label="Close chat">
                  <Close />
                </IconButton>
              </Box>
            </Box>

            <Box ref={listRef} sx={{ flex: 1, p: 2, overflowY: 'auto', background: 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.00))' }}>
              {messages.length === 0 && (
                <Typography sx={{ color: 'text.secondary', mt: 2 }}>Hi! Ask me about medicines, reminders, or your account.</Typography>
              )}
              {messages.map((m, i) => (
                <Box key={i} sx={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', mb: 1.5 }}>
                  <Box sx={{ maxWidth: '80%', p: 1.25, borderRadius: 2, background: m.role === 'user' ? 'linear-gradient(135deg,#d1ffd9,#eafff0)' : 'rgba(255,255,255,0.9)', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>{m.text}</Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask DoseMate AI..."
                size="small"
                fullWidth
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage() } }}
              />
              <IconButton onClick={sendMessage} disabled={loading} aria-label="Send message" sx={{ bgcolor: 'var(--brand)', color: '#fff', '&:hover': { bgcolor: 'var(--brand-dark)' } }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
              </IconButton>
            </Box>
          </Paper>
        )}
      </Box>
    </>
  )
}
