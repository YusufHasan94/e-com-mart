"use client"

import { ReactNode, useMemo } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"

interface StripeProviderProps {
    clientSecret: string
    children: ReactNode
}

export function StripeProvider({ clientSecret, children }: StripeProviderProps) {
    const stripePromise = useMemo(() => getStripe(), [])

    const options = useMemo(
        () => ({
            clientSecret,
            appearance: {
                theme: "stripe" as const,
                variables: {
                    colorPrimary: "#6366f1",
                    colorBackground: "#ffffff",
                    colorText: "#1a1a1a",
                    borderRadius: "6px",
                    fontFamily: "Inter, system-ui, sans-serif",
                },
            },
        }),
        [clientSecret]
    )

    if (!clientSecret) return <>{children}</>

    return (
        <Elements stripe={stripePromise} options={options}>
            {children}
        </Elements>
    )
}
