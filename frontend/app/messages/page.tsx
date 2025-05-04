"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { messagesAPI } from "@/lib/api-client"
import MainLayout from "@/components/layout/main-layout"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Send } from "lucide-react"

interface Message {
  id: number
  content: string
  createdAt: string
  sender: {
    id: number
    fullName: string
    email: string
  }
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // For demo purposes, we're using project ID 1
  const projectId = 1

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return

      try {
        const data = await messagesAPI.getChatMessages(projectId)
        setMessages(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch messages")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [user, projectId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    setSending(true)
    try {
      const messageData = {
        senderId: user.id,
        projectId,
        content: newMessage,
      }

      const sentMessage = await messagesAPI.sendMessage(messageData)
      setMessages([...messages, sentMessage])
      setNewMessage("")
    } catch (err: any) {
      setError(err.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Project Chat</h1>

          <Card className="flex h-[calc(100vh-12rem)] flex-col">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className="flex h-full items-center justify-center text-red-500">{error}</div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <div className="space-y-4 p-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender.id === user?.id ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="mb-1 text-xs font-medium">
                            {message.sender.id === user?.id ? "You" : message.sender.fullName}
                          </div>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <div
                            className={`mt-1 text-right text-xs ${
                              message.sender.id === user?.id ? "text-primary-foreground/70" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? <LoadingSpinner /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
