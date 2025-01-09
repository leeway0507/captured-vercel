'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { KRW } from '@/utils/currency'
import { ProductCartProps } from '@/types'
import calcTotalPrice from './calculate-price'

function DeliveryBox({
    intlShippingFee,
    domeShippingFee,
}: {
    intlShippingFee: number
    domeShippingFee: number
}) {
    const totalShippingFee = intlShippingFee + domeShippingFee
    const [isOpen, setIsOpen] = useState(false)
    const handleToggle = () => setIsOpen((old) => !old)
    const chevron = isOpen ? (
        <ChevronDown size="16px" strokeWidth="3" />
    ) : (
        <ChevronRight size="16px" strokeWidth="3" />
    )
    return (
        <>
            <button type="button" onClick={handleToggle} className="flex justify-between w-full">
                <div className="flex-center gap-2">
                    <span>총 배송비 </span>
                    <span>{chevron}</span>
                </div>
                <span> {KRW(totalShippingFee)}</span>
            </button>{' '}
            <div className={`${isOpen ? 'block' : 'hidden '}  text-gray-500 text-xs`}>
                <div className="flex justify-between w-full">
                    <span>국내 배송비</span>
                    <span>{KRW(domeShippingFee)}</span>
                </div>
                <div className=" flex justify-between w-full">
                    <span>해외 배송비</span>
                    <span>{KRW(intlShippingFee)}</span>
                </div>
            </div>
        </>
    )
}

export function PriceBox({ cartData }: { cartData: ProductCartProps[] }) {
    const { totalProductPrice, intlShippingFee, domeShippingFee } = calcTotalPrice(cartData)
    const totalShippingFee = intlShippingFee + domeShippingFee
    const totalPrice = totalProductPrice + totalShippingFee

    return (
        <div className="flex flex-col gap-2 ">
            <div className="flex justify-between ">
                <div>물품가격</div>
                <div>{KRW(totalProductPrice)}</div>
            </div>
            <DeliveryBox intlShippingFee={intlShippingFee} domeShippingFee={domeShippingFee} />
            <div className="flex justify-between text-base">
                <div>총 결제금액</div>
                <div>{KRW(totalPrice)}</div>
            </div>
        </div>
    )
}
