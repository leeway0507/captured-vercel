'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import useCart, { CartProps } from '@/hooks/data/use-cart' // Assuming useCart returns a type `Cart`

type CartContextType = CartProps

const CartContext = createContext<CartContextType>({} as CartProps)

interface CartProviderProps {
    children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
    const cart = useCart()

    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

// Custom hook to use the CartContext
export const useCartContext = () => useContext(CartContext)
