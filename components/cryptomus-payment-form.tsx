"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2, Bitcoin, ShieldCheck } from "lucide-react"

interface CryptomusPaymentFormProps {
    amount: number
    currency?: string
    orderId?: string
    paymentMethod: string
    onSubmit: (data: any) => void
    onBack?: () => void
}

export function CryptomusPaymentForm({
    amount,
    currency = "USD",
    orderId,
    paymentMethod,
    onSubmit,
    onBack,
}: CryptomusPaymentFormProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        setErrorMessage("")

        try {
            const res = await fetch("/api/create-cryptomus-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, currency, orderId }),
            })

            const data = await res.json()

            if (!res.ok || !data.url) {
                setErrorMessage(data.error || "Failed to initialize crypto payment. Please try again.")
                setIsProcessing(false)
                return
            }

            // Pass the Cryptomus payment UUID back so it can be stored with the order
            onSubmit({
                paymentMethod,
                cryptomusUuid: data.uuid,
                cryptomusUrl: data.url,
            })

            // Redirect to the Cryptomus-hosted payment page (new tab)
            window.open(data.url, "_blank", "noopener,noreferrer")
        } catch (err: any) {
            setErrorMessage(err.message || "An unexpected error occurred.")
            setIsProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info card */}
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                <div className="flex items-center gap-2 font-medium">
                    <Bitcoin className="h-5 w-5 text-orange-500" />
                    <span>Pay with Cryptocurrency</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    After clicking <strong>Continue</strong>, you will be redirected to the Cryptomus
                    hosted payment page where you can choose your preferred cryptocurrency and
                    complete the payment securely.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    <span>Payments are secured and processed by Cryptomus</span>
                </div>
            </div>

            {/* Amount display */}
            <div className="rounded-lg border p-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount due</span>
                <span className="font-semibold text-lg">
                    {currency.toUpperCase()} {Number(amount).toFixed(2)}
                </span>
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
            )}

            <div className="flex gap-4">
                {onBack && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 bg-transparent"
                        disabled={isProcessing}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                )}
                <Button type="submit" className="flex-1" disabled={isProcessing}>
                    {isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Preparing payment…
                        </>
                    ) : (
                        <>
                            Continue to Crypto Payment
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
