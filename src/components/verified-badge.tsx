"use client"

import { BadgeCheck } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function VerifiedBadge({ size = 5 }: { size?: number }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <BadgeCheck className={`h-${size} w-${size} text-blue-500 inline-block ml-1`} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Entreprise Vérifiée</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
