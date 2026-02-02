"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiService, type ApiCurrency } from "@/lib/api-service"

interface CurrencyContextType {
    currencies: ApiCurrency[]
    selectedCurrency: ApiCurrency | null
    setSelectedCurrency: (currency: ApiCurrency) => void
    isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currencies, setCurrencies] = useState<ApiCurrency[]>([])
    const [selectedCurrency, setSelectedCurrency] = useState<ApiCurrency | null>(null)
    const [isLoading, setIsLoading] = useState(true)

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
                            // Fallback to default
                            const defaultCurrency = response.data.find(c => c.is_default) || response.data[0]
                            setSelectedCurrency(defaultCurrency)
                        }
                    } else {
                        // Default to first currency or one marked as default
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
        setSelectedCurrency(currency)
        localStorage.setItem("selectedCurrencyCode", currency.code)
    }

    return (
        <CurrencyContext.Provider value={{
            currencies,
            selectedCurrency,
            setSelectedCurrency: handleSetSelectedCurrency,
            isLoading
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
