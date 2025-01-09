'use server'

import { handleFetchError } from '../utils/error/handle-fetch-error'
import { fetchWithAuth } from '../utils/custom-fetch'
import { OrderHistoryRequestProps, ProductCartProps } from '../types'

const transformToOrderRows = (items: ProductCartProps[], orderId: string) =>
    items.map((i) => ({
        orderId,
        sku: i.product.sku,
        size: i.size,
        quantity: i.quantity,
    }))

export async function savePaymentInfo(
    orderId: string,
    addressId: string,
    totalPrice: number,
    orderItems: ProductCartProps[],
) {
    const data = {
        orderId,
        addressId,
        orderTotalPrice: totalPrice,
        orderRows: transformToOrderRows(orderItems, orderId),
    }
    const url = `${process.env.AUTH_API_URL}/api/order/save-order-info-before-payment`
    const fetchFn = () => fetchWithAuth(url, 'POST', data)
    return handleFetchError(fetchFn)
}

interface PaymentInfo {
    orderTotalPrice: number
}

export async function getPaymentVerification(OrderId: string) {
    const url = `${process.env.AUTH_API_URL}/api/order/get-order-info-before-payment?orderId=${OrderId}`
    const fetchFn = () => fetchWithAuth<PaymentInfo>(url, 'GET')
    return handleFetchError(fetchFn)
}

export async function confirmPaymentFromTossServer(
    secretKey: string,
    paymentKey: string,
    amount: string,
    orderId: string,
) {
    const fetchFn = async () => {
        const res = await fetch(`https://api.tosspayments.com/v1/payments/confirm`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentKey,
                amount,
                orderId,
            }),
        })

        return { status: res.status, data: await res.json() }
    }
    return handleFetchError(fetchFn)
}

export async function createOrderHistory(orderHistory: OrderHistoryRequestProps) {
    const url = `${process.env.AUTH_API_URL}/api/order/create-order-history`
    const fetchFn = () => fetchWithAuth(url, 'POST', orderHistory)
    return handleFetchError(fetchFn)
}
