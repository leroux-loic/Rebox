"use client"

import { ChatDialog } from "@/components/chat-dialog"
import { VerifiedBadge } from "@/components/verified-badge"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Package, User, MessageCircle } from "lucide-react"
import Link from "next/link"
import MapWrapper from "@/components/map-wrapper"

export default function ListingDetailsPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const router = useRouter()
    const [listing, setListing] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [reserving, setReserving] = useState(false)

    useEffect(() => {
        fetchListing()
    }, [id])

    const fetchListing = async () => {
        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(company_name, is_verified)')
            .eq('id', id as string)
            .single()

        if (!error && data) {
            setListing(data)
        }
        setLoading(false)
    }

    const handleReserve = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setReserving(true)
        const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase()

        const { error } = await supabase
            .from('orders')
            .insert({
                buyer_id: user.id,
                listing_id: listing.id,
                pickup_code: pickupCode,
                status: 'reserved'
            } as any)

        if (error) {
            alert("Erreur lors de la réservation: " + error.message)
            setReserving(false)
        } else {
            // Notify the seller
            await supabase.from('notifications').insert({
                user_id: listing.seller_id,
                title: "Nouvelle réservation !",
                message: `Votre annonce "${listing.title}" a été réservée. Code: ${pickupCode}`,
                type: "info"
            } as any)

            alert(`Réservation réussie ! Votre code de retrait : ${pickupCode}`)
            router.push('/dashboard/individual')
        }
    }

    if (loading) return <div className="p-8">Chargement...</div>
    if (!listing) return <div className="p-8">Annonce introuvable.</div>

    return (
        <div className="container mx-auto py-8 px-4">
            <Link href="/dashboard/individual" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux annonces
            </Link>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                            src={listing.image_url || "https://placehold.co/600x400/D2B48C/ffffff?text=Carton"}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold">{listing.title}</h1>
                        <div className="flex items-center gap-4">
                            <Badge className="text-lg py-1 px-4 bg-forest">{listing.price === 0 ? "Gratuit" : `${listing.price}€`}</Badge>
                            <Badge variant="outline" className="text-lg py-1 px-4">{listing.quantity} unités</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-5 w-5" />
                            <span>Vendu par {listing.profiles?.company_name || "Vendeur"}</span>
                        </div>

                        <p className="text-lg">{listing.description}</p>

                        <div className="pt-4">
                            {user && user.id === listing.seller_id ? (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 text-center">
                                    Vous êtes le vendeur de cet article.
                                </div>
                            ) : (
                                <>
                                    {/* Stripe Payment Button - Only option now */}
                                    {listing.status !== 'reserved' && (
                                        <Button
                                            size="lg"
                                            className="w-full bg-forest hover:bg-forest/90 text-white"
                                            onClick={async () => {
                                                if (!user) {
                                                    router.push('/login')
                                                    return
                                                }

                                                try {
                                                    const res = await fetch('/api/checkout', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            listingId: listing.id,
                                                            title: listing.title,
                                                            price: listing.price,
                                                            userId: user.id,
                                                            sellerId: listing.seller_id
                                                        })
                                                    })

                                                    const data = await res.json()
                                                    if (data.error) throw new Error(data.error)

                                                    // Create pending order
                                                    const { error: orderError } = await supabase.from('orders').insert({
                                                        buyer_id: user.id,
                                                        listing_id: listing.id,
                                                        pickup_code: "PENDING",
                                                        status: 'reserved',
                                                        payment_status: 'pending',
                                                        stripe_session_id: data.sessionId
                                                    } as any)

                                                    if (orderError) {
                                                        console.error("Order creation failed:", orderError)
                                                        alert("Erreur lors de la création de la commande")
                                                        return
                                                    }

                                                    if (data.url) window.location.href = data.url
                                                } catch (err: any) {
                                                    alert("Erreur paiement: " + err.message)
                                                }
                                            }}
                                        >
                                            💳 Acheter maintenant ({listing.price}€)
                                        </Button>
                                    )}
                                </>
                            )}

                            {user && user.id !== listing.seller_id && (
                                <ChatDialog
                                    listingId={listing.id}
                                    receiverId={listing.seller_id}
                                    receiverName={listing.profiles?.company_name || "Vendeur"}
                                    trigger={
                                        <Button variant="outline" className="w-full border-forest text-forest hover:bg-forest/10 mt-3">
                                            <MessageCircle className="mr-2 h-4 w-4" /> Contacter le vendeur
                                        </Button>
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-[400px] rounded-lg border overflow-hidden">
                    <MapWrapper
                        center={[listing.location_lat, listing.location_lng]}
                        zoom={15}
                        markers={[{
                            id: listing.id,
                            position: [listing.location_lat, listing.location_lng],
                            title: listing.title
                        }]}
                    />
                </div>
            </div>
        </div>
    )
}
