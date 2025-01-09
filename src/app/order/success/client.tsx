'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { saveToLocal } from '@/utils/storage'
import { deleteOrderItemCookie } from './action'

export default function Success({ orderId }: { orderId: string }) {
    useEffect(() => {
        const deletCookies = async () => deleteOrderItemCookie()
        // 5/ 카트 데이터를 초기화하고 결제 완료 페이지로 이동한다.
        saveToLocal(process.env.NEXT_PUBLIC_CART_LOCAL_STORAGE_KEY!, '')
        deletCookies()
        redirect(`/mypage?orderId=${orderId}`)
    }, [])
    return null
}
