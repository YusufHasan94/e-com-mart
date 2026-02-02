"use client"

import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode, type Dispatch } from "react"

export interface CartItem {
  id: string | number
  title: string
  price: number
  originalPrice?: number
  image: string
  category: string
  platform: string
  quantity: number
  discount?: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string | number }
  | { type: "UPDATE_QUANTITY"; payload: { id: string | number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: Dispatch<CartAction>
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string | number) => void
  updateQuantity: (id: string | number, quantity: number) => void
  clearCart: () => void
  setOpenCartDrawer: (callback: () => void) => void
  openCartDrawer: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => String(item.id) === String(action.payload.id))

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          String(item.id) === String(action.payload.id) ? { ...item, quantity: item.quantity + 1 } : item,
        )
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

        return { items: updatedItems, total, itemCount }
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => String(item.id) !== String(action.payload))
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: newItems, total, itemCount }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.id })
      }

      const updatedItems = state.items.map((item) =>
        String(item.id) === String(action.payload.id) ? { ...item, quantity: action.payload.quantity } : item,
      )
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

      return { items: updatedItems, total, itemCount }
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }

    case "LOAD_CART": {
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)

      return { items: action.payload, total, itemCount }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })
  const openCartDrawerCallbackRef = useRef<(() => void) | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
    // Open cart drawer after adding item
    if (openCartDrawerCallbackRef.current) {
      try {
        openCartDrawerCallbackRef.current()
      } catch (error) {
        console.error("Error opening cart drawer:", error)
      }
    }
  }

  const removeItem = (id: string | number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string | number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const setOpenCartDrawer = (callback: () => void) => {
    openCartDrawerCallbackRef.current = callback
  }

  const openCartDrawer = () => {
    if (openCartDrawerCallbackRef.current) {
      try {
        openCartDrawerCallbackRef.current()
      } catch (error) {
        console.error("Error opening cart drawer:", error)
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOpenCartDrawer,
        openCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
