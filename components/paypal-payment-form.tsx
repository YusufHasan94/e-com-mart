"use client"

import { useState, useMemo } from "react"
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react"

interface PayPalPaymentFormProps {
    amount: number
    currency?: string
    paymentMethod: string
    onSubmit: (data: any) => void
    onBack?: () => void
}

// Inner component to safely render buttons only when script is loaded
function PayPalButtonsInner({
    amount,
    currency,
    paymentMethod,
    onSubmit,
    onBack,
    isProcessing,
    setIsProcessing,
    errorMessage,
    setErrorMessage,
    handleCreateOrder,
    handleApprove
}: any) {
    const [{ isResolved }] = usePayPalScriptReducer();

    return (
        <div className="space-y-6">
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                    Pay quickly and securely with your PayPal account or with a debit/credit card through PayPal.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                    <span>Your transaction is secure and encrypted by PayPal</span>
                </div>
            </div>

            {errorMessage && (
                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
            )}

            <div className="relative min-h-[150px]">
                {!isResolved && (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm">Loading PayPal...</span>
                    </div>
                )}

                {/* {isResolved && (
                    <PayPalButtons
                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                        createOrder={handleCreateOrder}
                        onApprove={handleApprove}
                        onError={(err) => {
                            console.error("PayPal Button error:", err)
                            setErrorMessage("An error occurred with PayPal. Please try again.")
                        }}
                    />
                )} */}

                {isProcessing && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
            </div>

            {onBack && !isProcessing && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="w-full bg-transparent"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to method selection
                </Button>
            )}
        </div>
    );
}

export function PayPalPaymentForm({
    amount,
    currency = "USD",
    paymentMethod,
    onSubmit,
    onBack,
}: PayPalPaymentFormProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const initialOptions = useMemo(() => ({
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: currency.toUpperCase(),
        intent: "capture",
        components: "buttons",
    }), [currency])

    const handleCreateOrder = async () => {
        try {
            const response = await fetch("/api/create-paypal-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, currency }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to create PayPal order")
            }

            return data.id
        } catch (error: any) {
            setErrorMessage(error.message)
            throw error
        }
    }

    const handleApprove = async (data: any) => {
        setIsProcessing(true)
        try {
            const response = await fetch("/api/capture-paypal-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: data.orderID }),
            })

            const captureData = await response.json()

            if (!response.ok) {
                throw new Error(captureData.error || "Failed to capture PayPal payment")
            }

            onSubmit({
                paymentMethod,
                paypalOrderId: data.orderID,
                paypalCaptureId: captureData.purchase_units[0].payments.captures[0].id,
            })
        } catch (error: any) {
            setErrorMessage(error.message)
            setIsProcessing(false)
        }
    }

    const isValidId = initialOptions.clientId && initialOptions.clientId !== "your-paypal-client-id-here"

    if (!isValidId) {
        return (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-amber-800 font-semibold">
                    <span>⚠️ PayPal Setup Required</span>
                </div>
                <p className="text-sm text-amber-700 leading-relaxed">
                    The PayPal integration is ready, but you haven't added your <strong>Client ID</strong> to <code>.env.local</code> yet.
                </p>
                <div className="text-xs text-amber-600 bg-white/50 p-3 rounded border border-amber-100 italic">
                    Note: To test this, get your sandbox keys from the <a href="https://developer.paypal.com/dashboard/applications/sandbox" target="_blank" rel="noopener noreferrer" className="underline font-bold">PayPal Developer Portal</a>.
                </div>
                {onBack && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="w-full bg-white border-amber-200 text-amber-800 hover:bg-amber-100"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to other methods
                    </Button>
                )}
            </div>
        )
    }

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtonsInner
                amount={amount}
                currency={currency}
                paymentMethod={paymentMethod}
                onSubmit={onSubmit}
                onBack={onBack}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                handleCreateOrder={handleCreateOrder}
                handleApprove={handleApprove}
            />
        </PayPalScriptProvider>
    )
}
