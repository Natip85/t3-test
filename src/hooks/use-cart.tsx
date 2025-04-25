'use client'

import {createContext, useContext, useEffect, useState} from 'react'

export interface CartItem {
  productId: number
  variantId: number
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CartState {
  items: CartItem[]
  totalAmount: number
  totalQuantity: number
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Local storage key
const CART_STORAGE_KEY = 't3-test-cart'

const CartContextProvider = ({children}: {children: React.ReactNode}) => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
  })
  console.log('cart>>>>', cart)

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart) as CartState
        setCart(parsedCart)
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const updateTotals = (items: CartItem[]) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

    setCart({
      items,
      totalAmount,
      totalQuantity,
    })
  }

  const addItem = (item: CartItem) => {
    const existing = cart.items.find((i) => i.productId === item.productId)
    let updatedItems

    if (existing) {
      updatedItems = cart.items.map((i) =>
        i.productId === item.productId ? {...i, quantity: i.quantity + item.quantity} : i
      )
    } else {
      updatedItems = [...cart.items, item]
    }

    updateTotals(updatedItems)
  }

  const removeItem = (id: number) => {
    const updatedItems = cart.items.filter((item) => item.productId !== id)
    updateTotals(updatedItems)
  }

  const clearCart = () => {
    setCart({items: [], totalAmount: 0, totalQuantity: 0})
  }

  return <CartContext.Provider value={{...cart, addItem, removeItem, clearCart}}>{children}</CartContext.Provider>
}

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

export default CartContextProvider
