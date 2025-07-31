"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Smile, ArrowLeft, Leaf, Search } from "lucide-react"
import Link from "next/link"
import { LoginButton } from "@/components/auth/login-button"

const conversations = [
  {
    id: 1,
    name: "Dra. María González",
    specialty: "Terapia Psicológica",
    lastMessage: "Perfecto, nos vemos el viernes a las 3:00 PM",
    time: "10:30 AM",
    unread: 0,
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    specialty: "Coach de Vida",
    lastMessage: "Te envío algunos ejercicios para practicar",
    time: "Ayer",
    unread: 2,
    online: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Ana Sofía Ruiz",
    specialty: "Profesora de Yoga",
    lastMessage: "¿Cómo te sentiste después de la clase?",
    time: "Mar 15",
    unread: 0,
    online: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const messages = [
  {
    id: 1,
    sender: "professional",
    content: "¡Hola! Gracias por reservar una sesión conmigo. ¿Hay algo específico en lo que te gustaría trabajar?",
    time: "9:15 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    sender: "user",
    content: "Hola doctora, he estado sintiendo mucha ansiedad últimamente, especialmente en situaciones sociales.",
    time: "9:18 AM",
  },
  {
    id: 3,
    sender: "professional",
    content:
      "Entiendo perfectamente. La ansiedad social es muy común y tiene tratamiento efectivo. En nuestra sesión del viernes podremos explorar esto más a fondo.",
    time: "9:20 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    sender: "user",
    content: "Perfecto, muchas gracias. ¿Hay algo que pueda hacer mientras tanto?",
    time: "9:22 AM",
  },
  {
    id: 5,
    sender: "professional",
    content:
      "Te recomiendo practicar ejercicios de respiración profunda cuando sientas ansiedad. También puedes intentar la técnica 5-4-3-2-1: identifica 5 cosas que puedes ver, 4 que puedes tocar, 3 que puedes escuchar, 2 que puedes oler y 1 que puedes saborear.",
    time: "9:25 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 6,
    sender: "user",
    content: "Excelente, lo voy a intentar. Nos vemos el viernes entonces.",
    time: "9:28 AM",
  },
  {
    id: 7,
    sender: "professional",
    content:
      "Perfecto, nos vemos el viernes a las 3:00 PM. Si tienes alguna pregunta antes de la sesión, no dudes en escribirme.",
    time: "10:30 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-green-800">Prinergia</span>
            </Link>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mensajes</h1>

          <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Conversaciones</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Buscar conversaciones..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 ${
                        selectedConversation === conversation.id ? "border-green-600 bg-green-50" : "border-transparent"
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                            <AvatarFallback>
                              {conversation.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                            <span className="text-xs text-gray-500">{conversation.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{conversation.specialty}</p>
                          <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-green-600 text-white text-xs">{conversation.unread}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dra. María González" />
                      <AvatarFallback>MG</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-medium">Dra. María González</h3>
                    <p className="text-sm text-gray-600">En línea • Terapia Psicológica</p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {message.sender === "professional" && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} alt="Professional" />
                          <AvatarFallback>MG</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === "user" ? "text-green-100" : "text-gray-500"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Escribe tu mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Mantén siempre un tono respetuoso y profesional en tus mensajes
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
