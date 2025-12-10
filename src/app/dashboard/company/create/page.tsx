"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateListingPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        quantity: "",
        length: "",
        width: "",
        height: "",
        location_lat: 48.8566, // Default Paris
        location_lng: 2.3522,
        image_url: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)

        // Construct dimensions string for backward compatibility/display
        const dimensionsStr = `${formData.length}x${formData.width}x${formData.height} cm`

        const { error } = await supabase
            .from('listings')
            .insert({
                seller_id: user.id,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                dimensions: dimensionsStr,
                length: parseInt(formData.length),
                width: parseInt(formData.width),
                height: parseInt(formData.height),
                location_lat: formData.location_lat,
                location_lng: formData.location_lng,
                image_url: formData.image_url,
                status: 'active'
            } as any)

        if (error) {
            alert("Erreur lors de la création: " + error.message)
            setLoading(false)
        } else {
            // Create notification
            await supabase.from('notifications').insert({
                user_id: user.id,
                title: "Annonce créée !",
                message: `Votre annonce "${formData.title}" est maintenant en ligne.`,
                type: "success"
            } as any)

            router.push('/dashboard/company')
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Link href="/dashboard/company" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Nouvelle annonce</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titre de l'annonce</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="Ex: Lot de 20 cartons déménagement"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Prix (€)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantité</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Localisation</Label>
                            <div className="flex gap-2 mb-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if ("geolocation" in navigator) {
                                            navigator.geolocation.getCurrentPosition((position) => {
                                                setFormData({
                                                    ...formData,
                                                    location_lat: position.coords.latitude,
                                                    location_lng: position.coords.longitude
                                                })
                                                alert("Position trouvée !")
                                            }, (error) => {
                                                alert("Erreur de géolocalisation: " + error.message)
                                            })
                                        } else {
                                            alert("La géolocalisation n'est pas supportée par votre navigateur.")
                                        }
                                    }}
                                >
                                    📍 Utiliser ma position actuelle
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
                                    <Input
                                        id="lat"
                                        type="number"
                                        step="any"
                                        value={formData.location_lat}
                                        onChange={(e) => setFormData({ ...formData, location_lat: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lng" className="text-xs text-muted-foreground">Longitude</Label>
                                    <Input
                                        id="lng"
                                        type="number"
                                        step="any"
                                        value={formData.location_lng}
                                        onChange={(e) => setFormData({ ...formData, location_lng: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Dimensions (cm)</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="length" className="text-xs text-muted-foreground">Longueur (L)</Label>
                                    <Input
                                        id="length"
                                        type="number"
                                        min="1"
                                        value={formData.length}
                                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                        required
                                        placeholder="Ex: 60"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="width" className="text-xs text-muted-foreground">Largeur (l)</Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        min="1"
                                        value={formData.width}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                        required
                                        placeholder="Ex: 40"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="height" className="text-xs text-muted-foreground">Hauteur (H)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        min="1"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        required
                                        placeholder="Ex: 40"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Détails sur l'état, la provenance..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Photo (Optionnel)</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return

                                    const fileExt = file.name.split('.').pop()
                                    const fileName = `${Math.random()}.${fileExt}`
                                    const filePath = `${fileName}`

                                    const { error: uploadError } = await supabase.storage
                                        .from('listings')
                                        .upload(filePath, file)

                                    if (uploadError) {
                                        alert('Erreur upload (avez-vous créé le bucket "listings" ?): ' + uploadError.message)
                                    } else {
                                        const { data } = supabase.storage.from('listings').getPublicUrl(filePath)
                                        setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
                                    }
                                }}
                            />
                            {formData.image_url && (
                                <p className="text-sm text-green-600">Image uploadée avec succès !</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full bg-forest hover:bg-forest/90 text-white" disabled={loading}>
                            {loading ? "Publication..." : "Publier l'annonce"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
