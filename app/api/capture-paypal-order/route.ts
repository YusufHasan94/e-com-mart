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
        const { orderId } = await request.json()

        if (!orderId) {
            return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
        }

        const accessToken = await getAccessToken()

        const captureResponse = await fetch(
            `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )

        const captureData = await captureResponse.json()

        if (!captureResponse.ok) {
            console.error("PayPal Capture Order error:", captureData)
            return NextResponse.json(
                { error: captureData?.message || "Failed to capture PayPal order" },
                { status: captureResponse.status }
            )
        }

        return NextResponse.json(captureData)
    } catch (error: any) {
        console.error("PayPal capture route error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
