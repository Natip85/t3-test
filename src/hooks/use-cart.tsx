'use client'

import {api} from '@/trpc/react'
import {createContext, useContext, useEffect, useState} from 'react'

export interface CartItem {
  productId: number
  variantId?: number | null
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
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: number, variantId: number | null) => Promise<void>
  clearCart: () => void
  updateQuantity: (productId: number, variantId: number | null, quantity: number) => Promise<void>
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Local storage key
export const CART_STORAGE_KEY = 't3-test-cart'
export const CART_ID_STORAGE_KEY = 'cartId'

const CartContextProvider = ({children}: {children: React.ReactNode}) => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
  })
  console.log('cart context>>>>', cart)
  const [cartId, setCartId] = useState<number | null>(null)
  const {mutateAsync: create} = api.carts.createCart.useMutation()
  const {mutateAsync: add} = api.carts.addItem.useMutation()
  const {mutateAsync: update} = api.carts.updateItemQuantity.useMutation()
  const {mutateAsync: remove} = api.carts.removeItem.useMutation()

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    const storedCartId = localStorage.getItem(CART_ID_STORAGE_KEY)

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart) as CartState
        setCart(parsedCart)
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }

    if (storedCartId) {
      setCartId(parseInt(storedCartId))
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

  const addItem = async (item: CartItem) => {
    let currentCartId = cartId

    // If no cart yet, create one
    if (!currentCartId) {
      try {
        currentCartId = await create()
        setCartId(currentCartId)
        localStorage.setItem(CART_ID_STORAGE_KEY, currentCartId.toString())
      } catch (error) {
        console.error('Failed to create cart:', error)
      }
    }

    // Sync to DB if cart exists
    if (currentCartId) {
      try {
        await add({...item, cartId: currentCartId})
      } catch (error) {
        console.error('Failed to add item to cart in DB:', error)
      }
    }

    // Update local state
    const existing = cart.items.find((i) => i.productId === item.productId && i.variantId === item.variantId)
    let updatedItems

    if (existing) {
      updatedItems = cart.items.map((i) =>
        i.productId === item.productId && i.variantId === item.variantId
          ? {...i, quantity: i.quantity + item.quantity}
          : i
      )
    } else {
      updatedItems = [...cart.items, item]
    }

    updateTotals(updatedItems)
  }

  const updateQuantity = async (productId: number, variantId: number | null, quantity: number) => {
    const updatedItems = cart.items
      .map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return {...item, quantity}
        }
        return item
      })
      .filter((item) => item.quantity > 0)

    updateTotals(updatedItems)

    if (cartId) {
      try {
        await update({cartId, productId, variantId, quantity})
      } catch (error) {
        console.error('Failed to update quantity in DB:', error)
      }
    }
  }

  const removeItem = async (productId: number, variantId: number | null) => {
    const updatedItems = cart.items.filter((item) => !(item.productId === productId && item.variantId === variantId))
    updateTotals(updatedItems)

    if (cartId) {
      try {
        await remove({cartId, productId, variantId})
      } catch (error) {
        console.error('Failed to remove item from cart in DB:', error)
      }
    }
  }

  const clearCart = () => {
    setCart({items: [], totalAmount: 0, totalQuantity: 0})
  }

  return (
    <CartContext.Provider value={{...cart, addItem, removeItem, clearCart, updateQuantity}}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

export default CartContextProvider
