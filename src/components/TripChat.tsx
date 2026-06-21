'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Message } from '@/types'
import Input from './ui/Input'
import Button from './ui/Button'
import { formatDate } from '@/lib/utils'

interface TripChatProps {
  tripId: string
}

interface MessageWithUser extends Message {
  user: {
    id: string
    email: string
    name: string | null
  }
}

export default function TripChat({ tripId }: TripChatProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<MessageWithUser[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}/messages`)
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await response.json()
      setMessages(data.messages)
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [tripId])

  useEffect(() => {
    fetchMessages()
  }, [tripId, fetchMessages])


  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    setError('')

    try {
      const response = await fetch(`/api/trips/${tripId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const data = await response.json()
      setMessages(prev => [...prev, data.message])
      setNewMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow border border-divider p-6">
        <h3 className="text-lg font-semibold text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Trip Chat</h3>
        <div className="text-center py-4 text-text-secondary bg-background-alt rounded-md">Loading messages...</div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow border border-divider">
      <div className="p-4 border-b border-divider">
        <h3 className="text-lg font-semibold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Trip Chat</h3>
        <p className="text-sm text-text-secondary">
          Chat with other trip participants
        </p>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-text-muted py-8 bg-background-alt rounded-md">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.userId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-3 py-2 ${
                  message.userId === user?.id
                    ? 'bg-accent text-text-inverse'
                    : 'bg-background-alt text-text-primary border border-divider'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.userId === user?.id
                    ? 'You'
                    : message.user.name || message.user.email}
                </div>
                <div className="text-sm">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.userId === user?.id
                      ? 'text-text-inverse opacity-80'
                      : 'text-text-muted'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-divider">
        {error && (
          <div className="text-error text-sm mb-3 bg-error/10 p-2 rounded border border-error/30">
            {error}
          </div>
        )}

        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={1000}
            disabled={sending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            size="sm"
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  )
}
