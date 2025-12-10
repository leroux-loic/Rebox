"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChatDialog } from "@/components/chat-dialog"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default function MessagesPage() {
    const { user } = useAuth()
    const [conversations, setConversations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchConversations()
        }
    }, [user])

    const fetchConversations = async () => {
        // Fetch distinct conversations. This is tricky with simple queries.
        // We'll fetch all messages involving the user, then group by listing_id + other_user_id client-side.
        // For V2 MVP, this is acceptable.

        const { data: messages, error } = await supabase
            .from('messages')
            .select('*, sender:sender_id(company_name, email), receiver:receiver_id(company_name, email), listings(title)')
            .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
            .order('created_at', { ascending: false })

        if (!error && messages) {
            const grouped = new Map()

            messages.forEach(msg => {
                const otherUserId = msg.sender_id === user!.id ? msg.receiver_id : msg.sender_id
                const key = `${msg.listing_id}-${otherUserId}`

                if (!grouped.has(key)) {
                    grouped.set(key, {
                        ...msg,
                        otherUser: msg.sender_id === user!.id ? msg.receiver : msg.sender,
                        lastMessage: msg.content,
                        lastMessageDate: msg.created_at
                    })
                }
            })

            setConversations(Array.from(grouped.values()))
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Mes Messages</h1>

            {loading ? (
                <p>Chargement...</p>
            ) : conversations.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                    <p className="text-muted-foreground mb-4">Vous n'avez aucun message.</p>
                    <Link href="/dashboard/individual">
                        <Button variant="outline">Trouver des cartons</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {conversations.map((conv) => (
                        <Card key={conv.id} className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-lg">
                                            {conv.otherUser?.company_name || "Utilisateur"}
                                            <span className="text-muted-foreground text-sm font-normal ml-2">
                                                • {conv.listings?.title}
                                            </span>
                                        </h3>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(conv.lastMessageDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {conv.sender_id === user!.id ? "Vous: " : ""}{conv.lastMessage}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <ChatDialog
                                        listingId={conv.listing_id}
                                        receiverId={conv.sender_id === user!.id ? conv.receiver_id : conv.sender_id}
                                        receiverName={conv.otherUser?.company_name || "Utilisateur"}
                                        trigger={
                                            <Button size="icon" variant="ghost">
                                                <MessageCircle className="h-5 w-5" />
                                            </Button>
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
