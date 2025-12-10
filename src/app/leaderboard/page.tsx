import { Leaderboard } from "@/components/leaderboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LeaderboardPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
            </Link>

            <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-forest">Le Panthéon du Recyclage 🌍</h1>
                    <p className="text-xl text-muted-foreground">
                        Découvrez les héros qui sauvent la planète, un carton à la fois.
                    </p>
                </div>

                <Leaderboard limit={50} />
            </div>
        </div>
    )
}
