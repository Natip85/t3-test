'use client'
import {CART_ID_STORAGE_KEY, CART_STORAGE_KEY, useCart} from '@/hooks/use-cart'
import {useEffect} from 'react'

export default function PurchaseSuccessClearCartPage() {
  const {clearCart} = useCart()

  useEffect(() => {
    clearCart()
    localStorage.removeItem(CART_STORAGE_KEY)
    localStorage.removeItem(CART_ID_STORAGE_KEY)
  }, [])

  return null
}
