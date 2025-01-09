import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { toast } from 'react-toastify'

import { ProductProps } from '@/types'
import { KRW } from '@/utils/currency'
import useCart from '@/hooks/data/use-cart'
import SideModal from '@/components/side-modal'
import { ProductImage } from '@/components/product/product-card'
import EmblaCarousel, { CarouselImage } from '@/components/carousel/carousel'
import { ToggleButton, ButtonBox, ConfirmButton } from '@/components/button'

import { ProductShipmentInfo, ProductShipmentInfoModal } from './shipment-info'

export function Container({ children }: { children: React.ReactNode }) {
    return <div className="flex gap-8 justify-between flex-col lg:flex-row ">{children}</div>
}

export function ImagePC({ product }: { product: ProductProps }) {
    const imageNameArray = ['main', 'sub-1', 'sub-2', 'sub-3']
    const ImageGrid = 'hidden lg:grid lg:grid-cols-2 overflow-auto w-full max-w-3xl gap-1 pt-6'
    const sku = product.sku.toString()
    return (
        <div className={`${ImageGrid}`}>
            {imageNameArray.map((name) => (
                <ProductImage key={name} sku={sku} imgName={name} />
            ))}
        </div>
    )
}

export function ImageMobile({ product }: { product: ProductProps }) {
    const imageNameArray = ['main', 'sub-1', 'sub-2', 'sub-3']
    return (
        <EmblaCarousel type="single">
            {imageNameArray.map((name) => (
                <CarouselImage
                    key={name}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/product/${product.sku}/resize/${name}.webp`}
                    width={400}
                    height={400}
                    alt="상품이미지"
                />
            ))}
        </EmblaCarousel>
    )
}

export function ImageLayer({ product }: { product: ProductProps }) {
    return (
        <>
            <ImagePC product={product} />
            <div className="block lg:hidden">
                <ImageMobile product={product} />
            </div>
        </>
    )
}

export function InfoLayout({ children }: { children: React.ReactNode }) {
    const InfoClass =
        'flex flex-col w-full gap-4 md:gap-8 lg:max-w-[380px] xl:max-w-[480px] px-2 md:py-8'

    return <aside className={`${InfoClass}`}>{children}</aside>
}

export function SpecBox({ product }: { product: ProductProps }) {
    const { brand, productName, price, intl, productId } = product

    return (
        <div className="flex flex-col text-main-black tracking-tidest gap-1 lg:text-base">
            <Link
                href={`/shop/?brand=${brand}`}
                className="text-lg lg:text-xl uppercase font-medium "
            >
                {brand}
            </Link>

            <div className="flex items-left justify-between capitalize text-gray-500">
                {productName}
            </div>
            <div className="flex-left justify-between gap-2 text-gray-500">
                {productId.toUpperCase()}
            </div>

            <div className="whitespace-nowrap relative py-3">
                <span className="text-lg lg:text-xl">{KRW(price)} </span>
                <span className="text-gray-500 text-sm">{intl && '관·부가세 포함'}</span>
            </div>
            <hr />
        </div>
    )
}

export function SizeBox({
    product,
    selectedSize,
    setSelectedSize,
}: {
    product: ProductProps
    selectedSize: string | undefined
    setSelectedSize: (s: string) => void
}) {
    return (
        <ButtonBox>
            {product.size.map((d) => (
                <ToggleButton
                    key={d}
                    data={d}
                    isActive={d === selectedSize}
                    handleFilterClick={setSelectedSize}
                />
            ))}
        </ButtonBox>
    )
}

export function AddToCartNormal({
    product,
    selectedSize,
}: {
    product: ProductProps
    selectedSize: string
}) {
    const { size } = product
    const inStock = !!(size && size.length > 0)

    const { addToCart } = useCart()

    const handleClick = () => {
        addToCart(product, selectedSize)
        toast(<div>장바구니에 담았습니다.</div>)
    }

    return (
        <ConfirmButton
            disabled={!inStock || !selectedSize}
            onClick={handleClick}
            className="w-full"
        >
            {inStock ? '장바구니 담기' : '품절'}
        </ConfirmButton>
    )
}

export function AddToCartMobile({
    product,
    selectedSize,
}: {
    product: ProductProps
    selectedSize: string
}) {
    const boxContainer =
        'flex items-center justify-between h-[70px] bg-white fixed bottom-0 left-0 px-4 w-full border-t-2 z-10'
    return (
        <div className={`${boxContainer}`}>
            <div className="basis-2/3 grow text-lg">{KRW(product.price)}</div>
            <AddToCartNormal product={product} selectedSize={selectedSize} />
        </div>
    )
}

export function AddToCart({
    product,
    selectedSize,
}: {
    product: ProductProps
    selectedSize: string
}) {
    return (
        <>
            <div className="hidden md:block">
                <AddToCartNormal product={product} selectedSize={selectedSize} />
            </div>
            <div className="block md:hidden">
                <AddToCartMobile product={product} selectedSize={selectedSize} />
            </div>
        </>
    )
}

export function SizeSelectionBox({ product }: { product: ProductProps }) {
    const [selectedSize, setSelectedSize] = useState<string>()
    const selectSize = useCallback((data: string | undefined) => {
        setSelectedSize((old) => {
            if (old === data) return undefined
            return data
        })
    }, [])
    return (
        <>
            <SizeBox product={product} selectedSize={selectedSize} setSelectedSize={selectSize} />
            <AddToCart product={product} selectedSize={selectedSize!} />
        </>
    )
}

export function ShipmentInfo({ product }: { product: ProductProps }) {
    const { intl } = product
    return <ProductShipmentInfo type={intl ? 'intl' : 'dome'} />
}

export function PolicyInfo() {
    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false)
    const closeDeliveryModal = () => setIsDeliveryOpen(false)

    const hadnleClick = () => setIsDeliveryOpen(true)

    return (
        <>
            <button
                type="button"
                onClick={hadnleClick}
                className="ps-1 pe-4 flex items-center w-full text-xl font-medium"
            >
                <span>배송 및 반품 안내</span>
                <span>
                    <ChevronRight strokeWidth="3" />
                </span>
            </button>
            <SideModal isOpen={isDeliveryOpen} closeModal={closeDeliveryModal}>
                <ProductShipmentInfoModal closeModal={closeDeliveryModal} />
            </SideModal>
        </>
    )
}
