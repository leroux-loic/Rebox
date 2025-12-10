import { NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase/client" // Note: In a real app, use supabase-admin for server-side operations

// Initialize Stripe with a placeholder if key is missing to avoid crash on build
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
    : null

export async function POST(req: Request) {
    try {
        const { listingId, price, title, userId, sellerId } = await req.json()

        if (!stripe) {
            return NextResponse.json(
                { error: "Stripe is not configured (Missing API Keys). This is a demo." },
                { status: 503 }
            )
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: title,
                        },
                        unit_amount: Math.round(price * 100), // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/cancel`,
            metadata: {
                listingId,
                userId,
                sellerId
            },
        })

        return NextResponse.json({ sessionId: session.id, url: session.url })
    } catch (error: any) {
        console.error("Stripe Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
