"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Star } from "lucide-react"

interface ReviewDialogProps {
    orderId: string
    revieweeId: string
    revieweeName: string
    trigger?: React.ReactNode
    onReviewSubmitted?: () => void
}

export function ReviewDialog({ orderId, revieweeId, revieweeName, trigger, onReviewSubmitted }: ReviewDialogProps) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!user || rating === 0) return

        setLoading(true)

        const { error } = await supabase
            .from('reviews')
            .insert({
                order_id: orderId,
                reviewer_id: user.id,
                reviewee_id: revieweeId,
                rating: rating,
                comment: comment
            } as any)

        if (error) {
            alert("Erreur lors de l'envoi de l'avis : " + error.message)
            setLoading(false)
        } else {
            alert("Merci pour votre avis ! ⭐")
            setOpen(false)
            setLoading(false)
            onReviewSubmitted?.()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm">
                        <Star className="mr-2 h-4 w-4" /> Noter
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Noter {revieweeName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Votre note</span>
                        <StarRating rating={rating} onRatingChange={setRating} className="scale-125" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-sm font-medium">Commentaire (optionnel)</span>
                        <Textarea
                            placeholder="Comment s'est passé le retrait ? Les cartons étaient-ils en bon état ?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-forest hover:bg-forest/90 text-white"
                        disabled={loading || rating === 0}
                    >
                        {loading ? "Envoi..." : "Envoyer mon avis"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
