'use client'

import { useEffect, useState } from 'react'
import { KRW } from '@/utils/currency'
import {
    AddressProps,
    OrderHistoryProps,
    OrderItemProps,
    ProductProps,
    ProductCartProps,
} from '@/types'
import { ProductImage } from '@/components/product/product-card'
import Spinner from '@/components/spinner/spinner'
import { ConfirmButton } from '@/components/button'
import { useRouter } from 'next/navigation'
import { ItemGroup, ItemRow } from '@/components/item'
import { ChevronLeft } from 'lucide-react'
import { getAddressById } from '@/actions/address'
import { getOrderItem } from '@/actions/order'
import { PriceBox } from '@/components/order/price-box'
import { AddressCard } from '@/components/address'
import CatchError from '@/utils/error/handle-fetch-error'

interface ProductHorizontalCardProps {
    sku: number
    brand: string
    productName: string
    productId: string
    price: number
    intl: boolean
    size: string
    quantity: number
}

function OrderProductDescription(p: Omit<ProductHorizontalCardProps, 'sku'>) {
    const { brand, productName, price, productId, intl, size, quantity } = p
    return (
        <div className="flex flex-col w-full justify-center  md: ">
            <span className="text-base md:text-lg">{brand}</span>
            <span className="text-gray-500 line-clamp-1">{productName}</span>
            <span className="uppercase text-gray-500">{productId}</span>
            <div className="flex justify-between">
                <span>{size}</span>
                <span className="underline text-gray-500">{intl ? '해외배송' : '국내배송'}</span>
            </div>
            <div className="flex justify-between pt-2">
                <span>{`수량 : ${quantity}`}</span>
                <span>{KRW(price)}</span>
            </div>
        </div>
    )
}

export function ProductHorizontalCard(p: ProductHorizontalCardProps) {
    const { sku, ...rest } = p
    return (
        <div className="flex gap-4">
            <ProductImage
                sku={sku.toString()}
                imgName="thumbnail"
                className="max-w-[100px] md:max-w-[125px] lg:max-w-[150px]"
            />
            <OrderProductDescription {...rest} />
        </div>
    )
}

function OrderProductInfo({ orderItems }: { orderItems: OrderItemProps[] }) {
    return orderItems.map((p) => <ProductHorizontalCard key={p.sku} {...p} />)
}

function OrderTitle({ children }: { children: React.ReactNode }) {
    return <h1 className="text-lg md:text-xl border-b pb-1 mb-2">{children}</h1>
}

const orderItemAdapter = (orderItems: OrderItemProps[]): ProductCartProps[] =>
    orderItems.map((p) => {
        const { size, quantity, ...rest } = p
        // 주의: 타입 강제 변경하였음
        return {
            product: rest as unknown as ProductProps,
            size,
            quantity,
            checked: true,
        }
    })

function OrderInfo({ order }: { order: OrderHistoryProps }) {
    const container = 'grid grid-rows-4 w-full grid-flow-col auto-cols-auto'
    return (
        <ItemGroup className={`${container}`}>
            <ItemRow name="주문정보" value={order.userOrderNumber} />
            <ItemRow name="결제방식" value={order.paymentMethod} />
            <ItemRow name="결제상태" value={order.paymentStatus} />
            <ItemRow name="결제금액" value={KRW(order.orderTotalPrice)} />
            <ItemRow name="주문상태" value={order.orderStatus} />
            <ItemRow name="결제일" value={order.orderedAt.replace('T', ' ')} />
            <ItemRow name="결제코드" value={order.orderId} />
        </ItemGroup>
    )
}

export default function OrderDetail({ order }: { order: OrderHistoryProps }) {
    const [orderItems, setOrderProducts] = useState<OrderItemProps[]>([])
    const [address, setAddress] = useState<AddressProps>()
    const router = useRouter()

    useEffect(() => {
        const getProducts = async () =>
            getOrderItem(order.orderId)
                .then(CatchError)
                .then((r) => setOrderProducts(r))

        const getaddressInfo = async () =>
            getAddressById(order.addressId)
                .then(CatchError)
                .then((r) => setAddress(r))

        getaddressInfo()
        getProducts()
    }, [])

    const handleOnClick = () => {
        const url = new URL(window.location.href)
        url.searchParams.delete('orderId')
        router.push(url.href)
    }

    if (orderItems.length === 0 && !address) return <Spinner />

    return (
        <div className="space-y-8  max-w-xl mx-auto">
            <ChevronLeft onClick={handleOnClick} className="cursor-pointer" />
            <section>
                <OrderTitle>주문상태</OrderTitle>
                <OrderInfo order={order} />
            </section>
            <section>
                <OrderTitle>배송정보</OrderTitle>
                <AddressCard address={address} />
            </section>
            <section>
                <OrderTitle>상세주문정보</OrderTitle>
                <OrderProductInfo orderItems={orderItems} />
                <div className="border-b h-2 my-2" />
                <PriceBox cartData={orderItemAdapter(orderItems)} />
            </section>
            <ConfirmButton onClick={handleOnClick} className="w-full">
                돌아가기
            </ConfirmButton>
        </div>
    )
}
