import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { Session } from 'next-auth'
import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { ProductCartProps } from '@/types'
import { getAddressAll } from '@/actions/address'
import { checkCartItems } from '@/actions/order'
import Spinner from '@/components/spinner/spinner'
import { PriceBox } from '@/components/order/price-box'
import { ProductHorizontalCard } from '@/components/product'
import { PaymentProvider } from '@/components/context/payment-provider'

import CatchError from '@/utils/error/handle-fetch-error'
import { fetchProduct } from '@/actions/product'
import { AddressBox, ClientRendering } from './client'
import TossPaymentsWidget from './toss-payment-widget'

function OrderDetails({ data }: { data: ProductCartProps[] }) {
    return (
        <section className="basis-3/5 w-full ">
            <h1 className="text-xl lg:text-2xl text-center pb-8 lg:pb-4">주문 요약</h1>
            <div className="space-y-1">
                {data.map((d) => (
                    <ProductHorizontalCard
                        {...d.product}
                        quantity={d.quantity}
                        size={d.size}
                        key={`${d.product.sku}-${d.size}`}
                    />
                ))}
            </div>
            <div className="h-3 border-b w-full my-2" />
            <PriceBox cartData={data} />
        </section>
    )
}

async function OrderOptions({ data }: { data: ProductCartProps[] }) {
    const session = (await auth()) as Session
    const addressArr = await getAddressAll().then(CatchError)

    return (
        <section className="basis-2/5 lg:mx-4">
            <h1 className="text-xl lg:text-2xl text-center pb-8 lg:pb-4">배송지 선택</h1>
            <PaymentProvider>
                <AddressBox data={addressArr} />
                <TossPaymentsWidget session={session.user} orderItems={data} />
            </PaymentProvider>
        </section>
    )
}

function OrderContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col lg:flex-row lg:gap-12 lg:justify-around w-full px-2 space-y-4 lg:space-y-0  ">
            {children}
        </div>
    )
}

export default async function Order() {
    const cookieStore = cookies()
    const orderItems = cookieStore.get('pd_ck')

    if (!orderItems?.value)
        return redirect(
            '/order/fail?code=FAIL_TO_GET_CART_ITEMS&message=비정상적인 접근입니다.다시 시도해 주세요.',
        )

    const reqItems: { sku: number; size: string; quantity: number }[] = JSON.parse(
        decodeURIComponent(atob(orderItems.value)),
    )
    const result = await checkCartItems(reqItems).then(CatchError)

    const availableItems = Object.entries(result).filter(([, status]) => status === true)
    if (availableItems.length === 0) redirect(`/redirection?message=오류가 발생했습니다.&to=/cart`)

    const cartData = reqItems.filter(({ size, sku }) =>
        availableItems.find(([form]) => form === `${sku}-${size}`),
    )
    const hasSoldOut = Object.keys(result).length !== cartData.length

    const data: ProductCartProps[] = await Promise.all(
        cartData.map((d) =>
            fetchProduct(d.sku.toString())
                .then(CatchError)
                .then((r) => ({ product: r, size: d.size, quantity: d.quantity, checked: true })),
        ),
    )
    return (
        <>
            <OrderContainer>
                <OrderDetails data={data} />
                <Suspense fallback={<Spinner />}>
                    <OrderOptions data={data} />
                </Suspense>
            </OrderContainer>
            <ClientRendering hasSoldOut={hasSoldOut} availableItems={availableItems} />
        </>
    )
}
