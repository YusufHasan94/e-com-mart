import { NextResponse } from "next/server"
import { signCryptomus } from "@/lib/cryptomus"

const CRYPTOMUS_BASE_URL = "https://api.cryptomus.com/v1"

export async function POST(request: Request) {
    try {
        const merchantUuid = process.env.CRYPTOMUS_MERCHANT_UUID
        const paymentApiKey = process.env.CRYPTOMUS_PAYMENT_API_KEY

        if (!merchantUuid || !paymentApiKey) {
            return NextResponse.json(
                { error: "Cryptomus credentials are not configured on the server." },
                { status: 500 }
            )
        }

        const { amount, currency = "USD", orderId } = await request.json()

        if (!amount || Number(amount) <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            )
        }

        const body = {
            amount: String(Number(amount).toFixed(2)),
            currency: currency.toUpperCase(),
            order_id: orderId || `order-${Date.now()}`,
            // Optional: add url_return / url_callback here once you have them
            // url_return: process.env.NEXT_PUBLIC_APP_URL + "/checkout?step=confirmation",
            // url_callback: process.env.NEXT_PUBLIC_APP_URL + "/api/cryptomus-webhook",
        }

        const sign = signCryptomus(body, paymentApiKey)

        const response = await fetch(`${CRYPTOMUS_BASE_URL}/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                merchant: merchantUuid,
                sign,
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (!response.ok || data.state !== 0) {
            console.error("Cryptomus API error:", data)
            return NextResponse.json(
                { error: data?.message || "Failed to create Cryptomus payment." },
                { status: response.status || 500 }
            )
        }

        // data.result.url  – hosted payment page for the customer
        // data.result.uuid – internal Cryptomus payment reference
        return NextResponse.json({
            url: data.result.url,
            uuid: data.result.uuid,
        })
    } catch (error: any) {
        console.error("Cryptomus route error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
