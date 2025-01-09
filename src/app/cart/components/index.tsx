'use client'

import { memo } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Plus, Minus, Trash2 } from 'lucide-react'

import { ProductCartProps, ProductProps } from '@/types'
import { KRW } from '@/utils/currency'
import { setCartItemsToCookies } from '@/actions/cart'
import { Button } from '@/components/shadcn-ui/button'
import { ConfirmButton } from '@/components/button'
import { ProductImage } from '@/components/product/product-card'
import Spinner from '@/components/spinner/spinner'
import { PriceBox } from '@/components/order/price-box'
import { CartProvider, useCartContext } from '@/components/context/cart-povider'

import { useRouter } from 'next/navigation'
import CartShipmentInfo from './shipment-info'
import { NoCartData } from './no-cart-data'

function ProductQtyUpdate({ product, size }: { product: ProductProps; size: string }) {
    const { cartData, increaseQty, decreaseQty } = useCartContext()
    const increaseQuantity = () => increaseQty(product, size)
    const decreaseQuantity = () => decreaseQty(product, size)
    const qty = cartData?.find((p) => p.product.sku === product.sku && p.size === size)?.quantity

    return (
        <div className="flex gap-2 items-center">
            <Button
                size="icon-sm"
                variant="ghost"
                type="button"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
            >
                <Minus size="12px" strokeWidth="3" />
            </Button>
            <div>{qty}</div>
            <Button
                size="icon-sm"
                variant="ghost"
                type="button"
                onClick={increaseQuantity}
                aria-label="Decrease quantity"
            >
                <Plus size="12px" strokeWidth="3" />
            </Button>
        </div>
    )
}

function RemoveCartItemButton({ product, size }: { product: ProductProps; size: string }) {
    const { removeToCart } = useCartContext()
    const handleRemoveProduct = () => {
        toast('장바구니에서 제거되었습니다.')
        removeToCart(product, size)
    }

    return (
        <Button variant="ghost" size="icon-sm" onClick={handleRemoveProduct}>
            <Trash2 size="20px" />
        </Button>
    )
}

const ProductDescription = memo(({ product, size }: { product: ProductProps; size: string }) => (
    <div className="flex flex-col w-full justify-center  md: ">
        <div className="flex justify-between items-center">
            <span className="text-base md:text-lg">{product.brand}</span>
            <RemoveCartItemButton product={product} size={size} />
        </div>
        <span className="text-gray-500 line-clamp-1">{product.productName}</span>
        <span className="uppercase text-gray-500">{product.productId}</span>
        <div className="flex justify-between">
            <span>{size}</span>
            <span className=" underline text-gray-500">
                {product.intl ? '해외배송' : '국내배송'}
            </span>
        </div>
        <div className="flex justify-between pt-2">
            <ProductQtyUpdate product={product} size={size} />
            <span>{KRW(product.price)}</span>
        </div>
    </div>
))

function CartCheckBox({
    product,
    size,
    checked,
}: {
    product: ProductProps
    size: string
    checked: boolean
}) {
    const { toggleCheckState } = useCartContext()

    return (
        <input
            type="checkbox"
            className="accent-black md:scale-[115%] w-4 md:mx-2"
            id={`${product.sku}-${size}`}
            defaultChecked={checked}
            onClick={() => toggleCheckState(product, size)}
        />
    )
}

const CartProductCard = memo(
    ({ product, size, checked }: { product: ProductProps; size: string; checked: boolean }) => (
        <div key={String(product.sku)} className="flex-center gap-3 border-b py-2 px-2">
            <CartCheckBox product={product} size={size} checked={checked} />
            <Link
                className="flex-center flex-col w-full  max-w-[100px] md:max-w-[125px] lg:max-w-[150px]"
                href={`/product/${product.sku}`}
            >
                <ProductImage sku={String(product.sku)} imgName="thumbnail" className="aspect-[1/1]" />
            </Link>
            <ProductDescription product={product} size={size} />
        </div>
    ),
)

function CartProductBox() {
    const { cartData } = useCartContext()

    if (!cartData) return <Spinner />
    if (cartData.length === 0) return <NoCartData />
    return (
        <section className="basis-3/5">
            {cartData.map((data) => (
                <CartProductCard
                    key={data.product.sku}
                    product={data.product}
                    size={data.size}
                    checked={data.checked}
                />
            ))}
        </section>
    )
}

function OrderButton({ cartData }: { cartData: ProductCartProps[] }) {
    const rotuer = useRouter()
    const handleClick = () =>
        setCartItemsToCookies(
            window.btoa(
                encodeURIComponent(
                    JSON.stringify(
                        cartData.map((d) => ({
                            sku: d.product.sku,
                            size: d.size,
                            quantity: d.quantity,
                        })),
                    ),
                ),
            ),
        ).then(() => rotuer.push('/order'))
    return (
        <ConfirmButton className="w-full" onClick={handleClick}>
            주문하기
        </ConfirmButton>
    )
}

function InfoBox() {
    const { cartData } = useCartContext()

    if (!cartData) return null
    if (cartData.length === 0) return null
    const checkedCartData = cartData ? cartData.filter((p) => p.checked) : []

    return (
        <aside className="flex flex-col w-full md:max-w-[350px] lg:max-w-[450px] gap-6 bg-gray-50 md:bg-white p-4 shadow-inner md:shadow-none">
            <PriceBox cartData={checkedCartData} />
            <OrderButton cartData={checkedCartData} />
            <CartShipmentInfo />
        </aside>
    )
}

function CartContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row md:gap-2 lg:gap-12 md:justify-around w-full page-max-frame mx-auto">
            {children}
        </div>
    )
}

function Cart() {
    return (
        <CartProvider>
            <CartContainer>
                <CartProductBox />
                <InfoBox />
            </CartContainer>
        </CartProvider>
    )
}

export default Cart
