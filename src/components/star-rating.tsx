"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    maxRating?: number
    onRatingChange?: (rating: number) => void
    readonly?: boolean
    className?: string
}

export function StarRating({
    rating,
    maxRating = 5,
    onRatingChange,
    readonly = false,
    className
}: StarRatingProps) {
    return (
        <div className={cn("flex items-center gap-1", className)}>
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1
                const isFilled = starValue <= rating

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={readonly}
                        onClick={() => onRatingChange?.(starValue)}
                        className={cn(
                            "focus:outline-none transition-colors",
                            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                        )}
                    >
                        <Star
                            className={cn(
                                "h-5 w-5",
                                isFilled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            )}
                        />
                    </button>
                )
            })}
        </div>
    )
}
