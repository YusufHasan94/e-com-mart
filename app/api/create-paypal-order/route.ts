import { NextResponse } from "next/server"

const PAYPAL_API = process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

async function getAccessToken() {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret || clientId === "your-paypal-client-id-here") {
        throw new Error("PayPal credentials are not configured. Please add them to your .env.local file.")
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })

    const data = await response.json()
    return data.access_token
}

export async function POST(request: Request) {
    try {
        const { amount, currency = "USD" } = await request.json()

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        const accessToken = await getAccessToken()

        const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency.toUpperCase(),
                            value: amount.toFixed(2),
                        },
                    },
                ],
            }),
        })

        const orderData = await orderResponse.json()

        if (!orderResponse.ok) {
            console.error("PayPal Create Order error:", orderData)
            return NextResponse.json(
                { error: orderData?.message || "Failed to create PayPal order" },
                { status: orderResponse.status }
            )
        }

        return NextResponse.json({ id: orderData.id })
    } catch (error: any) {
        console.error("PayPal route error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
