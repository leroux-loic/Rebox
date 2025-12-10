"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListingCard } from "@/components/listing-card"
import Link from "next/link"
import { StarRating } from "@/components/star-rating"
import { VerifiedBadge } from "@/components/verified-badge"

export default function ProfilePage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [sales, setSales] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [averageRating, setAverageRating] = useState<number | null>(null)
    const [reviewCount, setReviewCount] = useState(0)

    // Form state
    const [companyName, setCompanyName] = useState("")
    const [siret, setSiret] = useState("")
    const [headquartersAddress, setHeadquartersAddress] = useState("")
    const [pickupAddress, setPickupAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [website, setWebsite] = useState("")
    const [sameAddress, setSameAddress] = useState(false)

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        if (!user) return

        // 1. Fetch Profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileData) {
            setProfile(profileData)
            setCompanyName(profileData.company_name || "")
            setSiret(profileData.siret || "")
            setHeadquartersAddress(profileData.headquarters_address || "")
            setPickupAddress(profileData.pickup_address || "")
            setPhone(profileData.phone || "")
            setWebsite(profileData.website || "")

            // Check if addresses are the same to toggle checkbox
            if (profileData.headquarters_address && profileData.pickup_address && profileData.headquarters_address === profileData.pickup_address) {
                setSameAddress(true)
            }

            // Fetch reviews
            const { data: reviews } = await supabase
                .from('reviews')
                .select('rating')
                .eq('reviewee_id', user.id)

            if (reviews && reviews.length > 0) {
                const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                setAverageRating(avg)
                setReviewCount(reviews.length)
            }
        }

        // 2. Fetch Orders (as Buyer)
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*, listings(*, profiles(company_name))')
            .eq('buyer_id', user.id)
            .order('created_at', { ascending: false })

        if (ordersData) setOrders(ordersData)

        // 3. Fetch Sales (as Seller) - via Listings
        // This is a bit complex with Supabase simple client, let's fetch listings first then orders for those listings
        // Or just fetch orders where listing.seller_id = user.id if we had that relation directly exposed or via join
        // RLS policy "Sellers can view orders for their listings" allows us to query orders directly if we filter right?
        // Actually, let's just fetch orders and filter by existence of listing where seller_id = me
        // But we can't easily do deep filtering with simple client in one go without a view or complex query.
        // Let's try fetching listings first.
        if (profileData?.role === 'company') {
            const { data: myListings } = await supabase
                .from('listings')
                .select('id')
                .eq('seller_id', user.id)

            if (myListings && myListings.length > 0) {
                const listingIds = myListings.map(l => l.id)
                const { data: salesData } = await supabase
                    .from('orders')
                    .select('*, listings(*), profiles(*)') // profiles here is the buyer
                    .in('listing_id', listingIds)
                    .order('created_at', { ascending: false })

                if (salesData) setSales(salesData)
            }
        }

        setLoading(false)
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('profiles')
            .update({
                company_name: companyName,
                siret: siret,
                headquarters_address: headquartersAddress,
                pickup_address: sameAddress ? headquartersAddress : pickupAddress,
                phone: phone,
                website: website
            } as any)
            .eq('id', user!.id)

        if (error) {
            alert("Erreur: " + error.message)
        } else {
            alert("Profil mis à jour !")
        }
        setSaving(false)
    }

    if (loading) return <div className="p-8">Chargement...</div>

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

            <Tabs defaultValue="info" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="info">Mes Informations</TabsTrigger>
                    <TabsTrigger value="history">
                        {profile?.role === 'company' ? 'Mes Ventes' : 'Mes Commandes'}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info">
                    <Card className="max-w-md">
                        <CardHeader>
                            <CardTitle>Modifier mon profil</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={user?.email || ""} disabled />
                                    <div className="flex items-center gap-2 mt-1">
                                        {averageRating ? (
                                            <>
                                                <StarRating rating={Math.round(averageRating)} readonly className="scale-75 origin-left" />
                                                <span className="text-xs text-muted-foreground">({reviewCount} avis)</span>
                                            </>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Pas encore d'avis</span>
                                        )}
                                    </div>
                                </div>

                                {profile?.role === 'company' && (
                                    <div className="space-y-4 border-l-2 border-forest/20 pl-4">
                                        <div className="flex items-center gap-2">
                                            <Label>Nom de l'entreprise</Label>
                                            {profile?.is_verified && <VerifiedBadge />}
                                        </div>
                                        <Input
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Ex: Ma Société SAS"
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>SIRET</Label>
                                                <Input
                                                    value={siret}
                                                    onChange={(e) => setSiret(e.target.value)}
                                                    placeholder="14 chiffres"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Téléphone</Label>
                                                <Input
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="01 23 45 67 89"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Site Web</Label>
                                            <Input
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                placeholder="https://www.mon-site.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Adresse du Siège Social</Label>
                                            <Input
                                                value={headquartersAddress}
                                                onChange={(e) => {
                                                    setHeadquartersAddress(e.target.value)
                                                    if (sameAddress) setPickupAddress(e.target.value)
                                                }}
                                                placeholder="123 Rue de la République, 75001 Paris"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="checkbox"
                                                    id="sameAddress"
                                                    className="h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest"
                                                    checked={sameAddress}
                                                    onChange={(e) => {
                                                        setSameAddress(e.target.checked)
                                                        if (e.target.checked) {
                                                            setPickupAddress(headquartersAddress)
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="sameAddress"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    L'adresse de récupération est la même que le siège
                                                </label>
                                            </div>

                                            {!sameAddress && (
                                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                    <Label>Adresse de Récupération</Label>
                                                    <Input
                                                        value={pickupAddress}
                                                        onChange={(e) => setPickupAddress(e.target.value)}
                                                        placeholder="Entrepôt B, Zone Industrielle..."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Rôle</Label>
                                    <div className="capitalize">{profile?.role === 'company' ? 'Entreprise' : 'Particulier'}</div>
                                </div>

                                <Button type="submit" className="bg-forest text-white" disabled={saving}>
                                    {saving ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    {profile?.role === 'company' ? (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Historique des ventes</h2>
                            {sales.length === 0 ? (
                                <p>Aucune vente pour le moment.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {sales.map(sale => (
                                        <Card key={sale.id}>
                                            <CardContent className="p-4 flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold">{sale.listings?.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Acheteur: {sale.profiles?.company_name || "Anonyme"} ({sale.profiles?.role})
                                                    </div>
                                                    <div className="text-sm">Code retrait: <span className="font-mono font-bold">{sale.pickup_code}</span></div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg">{sale.listings?.price}€</div>
                                                    <div className={`text-sm ${sale.status === 'picked_up' ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {sale.status === 'picked_up' ? 'Terminé' : 'Réservé'}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold">Mes Commandes</h2>
                            {orders.length === 0 ? (
                                <p>Aucune commande pour le moment.</p>
                            ) : (
                                <div className="grid gap-4">
                                    {orders.map(order => (
                                        <Card key={order.id}>
                                            <CardContent className="p-4 flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold">{order.listings?.title}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Vendeur: {order.listings?.profiles?.company_name}
                                                    </div>
                                                    <div className="mt-2 p-2 bg-muted rounded inline-block">
                                                        Code de retrait: <span className="font-mono font-bold text-lg">{order.pickup_code}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-lg">{order.listings?.price}€</div>
                                                    <div className={`text-sm ${order.status === 'picked_up' ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {order.status === 'picked_up' ? 'Récupéré' : 'À récupérer'}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
