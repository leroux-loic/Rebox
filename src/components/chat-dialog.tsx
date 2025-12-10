"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"

interface ChatDialogProps {
    listingId: string
    receiverId: string
    receiverName: string
    trigger?: React.ReactNode
}

export function ChatDialog({ listingId, receiverId, receiverName, trigger }: ChatDialogProps) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open && user) {
            fetchMessages()
            subscribeToMessages()
        }
        return () => {
            supabase.removeAllChannels()
        }
    }, [open, user])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('listing_id', listingId)
            .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
            .order('created_at', { ascending: true })

        if (!error && data) {
            setMessages(data)
        }
        setLoading(false)
    }

    const subscribeToMessages = () => {
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `listing_id=eq.${listingId}`
                },
                (payload) => {
                    setMessages((current) => [...current, payload.new])
                }
            )
            .subscribe()
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) return

        const { error } = await supabase
            .from('messages')
            .insert({
                sender_id: user.id,
                receiver_id: receiverId,
                listing_id: listingId,
                content: newMessage.trim()
            } as any)

        if (error) {
            console.error("Error sending message:", error)
            alert("Erreur lors de l'envoi du message. Avez-vous créé la table 'messages' dans Supabase ? " + JSON.stringify(error))
        } else {
            setNewMessage("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Contacter
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Discussion avec {receiverName}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col h-[400px]">
                    <ScrollArea className="flex-1 p-4 border rounded-md mb-4">
                        {loading ? (
                            <p className="text-center text-muted-foreground">Chargement...</p>
                        ) : messages.length === 0 ? (
                            <p className="text-center text-muted-foreground">Aucun message. Dites bonjour ! 👋</p>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg) => {
                                    const isMe = msg.sender_id === user?.id
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${isMe
                                                    ? "bg-forest text-white"
                                                    : "bg-muted text-foreground"
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.content}</p>
                                                <span className="text-[10px] opacity-70 block mt-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={scrollRef} />
                            </div>
                        )}
                    </ScrollArea>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Votre message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} size="icon" className="bg-forest hover:bg-forest/90">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
