'use client'

import React, { createContext, useState, useContext, useMemo } from 'react'

interface PaymentContextType {
    addressId: string | undefined
    setAddressId: React.Dispatch<React.SetStateAction<string | undefined>>
}

const PaymentContext = createContext<PaymentContextType>({} as PaymentContextType)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
    const [addressId, setAddressId] = useState<string>()

    const value = useMemo(() => ({ addressId, setAddressId }), [addressId, setAddressId])

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
}

export const usePaymentContext = () => useContext(PaymentContext)
