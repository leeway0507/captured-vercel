'use client'

import useTossPayments from '@/hooks/interaction/use-toss-payments'
import { ProductCartProps } from '@/types'
import { CustomUser } from '@/auth'
import { nanoid } from 'nanoid'
import { ConfirmButton } from '@/components/button'
import { KRW } from '@/utils/currency'
// 결제 플로우 확인 : captured/keynote/flow
import calcTotalPrice from '@/components/order/calculate-price'
import { usePaymentContext } from '@/components/context/payment-provider'

export default function TossPaymentsWidget({
    session,
    orderItems,
}: {
    session: CustomUser
    orderItems: ProductCartProps[]
}) {
    const { totalProductPrice, domeShippingFee, intlShippingFee } = calcTotalPrice(orderItems)
    const totalPrice = totalProductPrice + domeShippingFee + intlShippingFee

    const { addressId } = usePaymentContext()

    const startPayment = useTossPayments({
        orderId: nanoid(),
        session,
        orderItems,
        totalPrice,
        addressId,
    })

    if (orderItems === undefined) return null

    return (
        <>
            <div id="payment-widget" className="w-full" />
            <div id="agreement" className="w-full" />
            <div className="flex justify-between px-4 py-2">
                <div>총 결제금액</div>
                <div>{KRW(totalPrice)}</div>
            </div>
            <ConfirmButton className="w-full text-base my-2 h-12 md:h-10" onClick={startPayment}>
                결제하기
            </ConfirmButton>
        </>
    )
}
