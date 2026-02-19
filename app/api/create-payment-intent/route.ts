import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-01-28.clover",
})

export async function POST(request: Request) {
    try {
        const { amount, currency = "usd" } = await request.json()

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            )
        }

        // Stripe expects amount in the smallest currency unit (cents for USD)
        const amountInCents = Math.round(amount * 100)

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency,
            automatic_payment_methods: { enabled: true },
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (error: any) {
        console.error("Stripe PaymentIntent error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create payment intent" },
            { status: 500 }
        )
    }
}
