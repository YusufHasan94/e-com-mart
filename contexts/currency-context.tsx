"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { apiService, type ApiCurrency } from "@/lib/api-service"

interface CurrencyContextType {
    currencies: ApiCurrency[]
    selectedCurrency: ApiCurrency | null
    setSelectedCurrency: (currency: ApiCurrency) => void
    isLoading: boolean
    currencySymbol: string
    convertPrice: (amount: number) => Promise<number>
    formatPrice: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currencies, setCurrencies] = useState<ApiCurrency[]>([])
    const [selectedCurrency, setSelectedCurrency] = useState<ApiCurrency | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Cache: key = `${amount}:${currencyCode}`, value = converted amount
    const conversionCache = useRef<Map<string, number>>(new Map())

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await apiService.getCurrencies()

                if (response.success && response.data) {
                    setCurrencies(response.data)

                    // Try to get stored currency
                    const storedCode = localStorage.getItem("selectedCurrencyCode")
                    if (storedCode) {
                        const found = response.data.find(c => c.code === storedCode)
                        if (found) {
                            setSelectedCurrency(found)
                        } else {
                            const defaultCurrency = response.data.find(c => c.is_default) || response.data[0]
                            setSelectedCurrency(defaultCurrency)
                        }
                    } else {
                        const defaultCurrency = response.data.find(c => c.is_default) || response.data[0]
                        setSelectedCurrency(defaultCurrency)
                    }
                } else {
                    console.warn("CurrencyProvider: Failed to fetch currencies or empty data", response.error)
                }
            } catch (error) {
                console.error("CurrencyProvider: Error fetching currencies:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCurrencies()
    }, [])

    const handleSetSelectedCurrency = (currency: ApiCurrency) => {
        // Clear cache when currency changes
        conversionCache.current.clear()
        setSelectedCurrency(currency)
        localStorage.setItem("selectedCurrencyCode", currency.code)
    }

    /**
     * Convert a USD base price to the selected currency using the API.
     * Results are cached per amount+currency to avoid redundant calls.
     */
    const convertPrice = useCallback(async (amount: number): Promise<number> => {
        if (!selectedCurrency || amount === 0) return amount

        // If selected currency is the default/base (USD), no conversion needed
        if (selectedCurrency.is_default) return amount

        const cacheKey = `${amount}:${selectedCurrency.code}`
        if (conversionCache.current.has(cacheKey)) {
            return conversionCache.current.get(cacheKey)!
        }

        try {
            const response = await apiService.convertCurrency(amount, selectedCurrency.code)
            if (response.success && response.data) {
                const converted = response.data.converted_amount
                conversionCache.current.set(cacheKey, converted)
                return converted
            }
        } catch (error) {
            console.error("convertPrice error:", error)
        }

        // Fallback: use exchange_rate from the currency object if API fails
        const rate = typeof selectedCurrency.rate === "number"
            ? selectedCurrency.rate
            : parseFloat(String(selectedCurrency.rate)) || 1
        const fallback = amount * rate
        conversionCache.current.set(cacheKey, fallback)
        return fallback
    }, [selectedCurrency])

    /**
     * Format a (already converted) price with the selected currency symbol.
     */
    const formatPrice = useCallback((amount: number): string => {
        const symbol = selectedCurrency?.symbol ?? "$"
        return `${symbol}${amount.toFixed(2)}`
    }, [selectedCurrency])

    const currencySymbol = selectedCurrency?.symbol ?? "$"

    return (
        <CurrencyContext.Provider value={{
            currencies,
            selectedCurrency,
            setSelectedCurrency: handleSetSelectedCurrency,
            isLoading,
            currencySymbol,
            convertPrice,
            formatPrice,
        }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider")
    }
    return context
}
