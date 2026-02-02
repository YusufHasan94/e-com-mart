import { useState, useRef, useEffect } from "react"
import { useCurrency } from "@/contexts/currency-context"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function CurrencyDropdown() {
    const { currencies, selectedCurrency, setSelectedCurrency, isLoading } = useCurrency()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    if (isLoading || !selectedCurrency) {
        return (
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center mr-1 text-[10px]">
                    $
                </span>
                USD
                <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
            </Button>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 text-xs transition-colors ${isOpen ? 'bg-accent' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center mr-1 text-[14px] font-bold">
                    {selectedCurrency.symbol}
                </span>
                {selectedCurrency.code}
                <ChevronDown className={`h-3 w-3 ml-1 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-md border bg-popover text-popover-foreground shadow-xl z-[9999] animate-in fade-in zoom-in-95 overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                        {currencies.map((currency) => (
                            <button
                                key={currency.id}
                                onClick={() => {
                                    setSelectedCurrency(currency)
                                    setIsOpen(false)
                                }}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs rounded-sm transition-colors hover:bg-accent ${selectedCurrency.code === currency.code ? "bg-accent text-primary font-bold" : "text-muted-foreground"
                                    }`}
                            >
                                <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[14px] font-semibold flex-shrink-0">
                                    {currency.symbol}
                                </span>
                                <span>{currency.code}</span>
                            </button>
                        ))}
                        {currencies.length === 0 && (
                            <div className="px-3 py-2 text-xs text-muted-foreground italic">
                                No currencies
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
