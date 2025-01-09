'use server'

import { fetchWithAuth } from '../utils/custom-fetch'

import { handleFetchError } from '../utils/error/handle-fetch-error'
import { OrderHistoryProps, OrderItemProps, CheckCartItemResultProps } from '../types'

export const getOrderHistory = async () => {
    const url = `${process.env.AUTH_API_URL}/api/order/get-order-history`
    const fetchFn = () => fetchWithAuth<OrderHistoryProps[]>(url, 'GET')
    const errorCase = { 401: '권한이 없습니다.' }
    return handleFetchError(fetchFn, errorCase)
}

export const getOrderItem = async (orderId: string) => {
    const url = `${process.env.AUTH_API_URL}/api/order/get-order-row?order_id=${orderId}`
    const fetchFn = () => fetchWithAuth<OrderItemProps[]>(url, 'GET')
    const errorCase = { 401: '권한이 없습니다.' }
    return handleFetchError(fetchFn, errorCase)
}

export const checkCartItems = async (cartItems: { sku: number; size: string }[]) => {
    const data = {
        form: cartItems.map((v) => `${v.sku}-${v.size}`),
        sku: cartItems.map((v) => v.sku),
    }

    const fetchFn = async () => {
        const res = await fetch(`${process.env.AUTH_API_URL}/api/order/check-size`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return { status: res.status, data: (await res.json()) as CheckCartItemResultProps }
    }

    const errorCase = { 401: '권한이 없습니다.' }
    return handleFetchError(fetchFn, errorCase)
}
