'use client'

import Image from 'next/image'
import Link from 'next/link'
import cn from '@/utils/cn'
import { ProductProps } from '@/types'
import EmblaCarousel from '../carousel/carousel'
import styles from '../carousel/styles.module.css'
import { ProductImage, Description } from '../product/product-card'
import { CancelButton } from '../button'

export function MoreButton({ link }: { link: string }) {
    return (
        <Link href={link} className="flex-center pt-8">
            <CancelButton size="xl" className="px-24">
                더보기
            </CancelButton>
        </Link>
    )
}

export function Container({
    children,
    className,
}: {
    children: React.ReactNode
    className: string
}) {
    return <div className={`${className}`}>{children}</div>
}

export function ResponsiveBanner({
    src,
    alt,
    className,
    imgClassName,
    aspect,
}: {
    src: string
    alt: string
    className?: string
    imgClassName?: string
    aspect?: string
}) {
    const defaultOptions = 'relative w-full mx-auto vignette rounded bg-orange-200'

    return (
        <div className={cn(defaultOptions, className, aspect)}>
            <Image
                src={src}
                alt={alt}
                fill
                className={cn('object-cover ', imgClassName)}
                unoptimized
            />
        </div>
    )
}

export function FixedBanner({
    src,
    alt,
    className,
}: {
    src: string
    alt: string
    className?: string
}) {
    const defaultOptions = 'w-full mx-auto vignette rounded '

    return (
        <div className={cn(defaultOptions, className)}>
            <Image src={src} alt={alt} height={1000} width={1000} unoptimized />
        </div>
    )
}

export function CardTitleOverlay({ name }: { name: string }) {
    return (
        <div className="absolute text-white z-10 flex-col flex-center gap-2 bg-black/20 w-full h-full">
            <div className="text-3xl font-medium capitalize">{name}</div>
        </div>
    )
}

export function FixedCardTitle({
    src,
    href,
    name,
    aspect,
}: {
    src: string
    href: string
    name: string
    aspect?: string
}) {
    return (
        <Link href={`${href}`} className="relative hover:opacity-95 w-full h-full flex ">
            <CardTitleOverlay name={name} />
            <FixedBanner src={src} alt={name} className={`${aspect}`} />
        </Link>
    )
}
export function ResponsiveCardTitle({
    src,
    href,
    name,
    aspect,
}: {
    src: string
    href: string
    name: string
    aspect?: string
}) {
    return (
        <Link href={`${href}`} className="relative hover:opacity-95">
            <CardTitleOverlay name={name} />
            <ResponsiveBanner src={src} alt={name} className={`${aspect}`} />
        </Link>
    )
}

export function ProductCardArr({
    data,
    className,
    maxItems = -1,
}: {
    data: ProductProps[]
    className?: string
    maxItems?: number
}) {
    return data.slice(0, maxItems).map((product: ProductProps) => (
        <Link
            href={`/product/${product.sku}`}
            key={product.sku}
            className={cn('flex-center flex-col w-full ', className)}
        >
            <ProductImage
                sku={String(product.sku)}
                imgName="thumbnail"
                className="max-w-[400px] bg-transparent aspect-[1/0.8]"
            />
            <Description product={product} />
        </Link>
    ))
}

export function ProductCardCarousel({
    productArr,
    maxItems = -1,
}: {
    productArr: ProductProps[]
    maxItems?: number
}) {
    return (
        <EmblaCarousel type="multi">
            <ProductCardArr data={productArr} className={styles.embla__slide} maxItems={maxItems} />
        </EmblaCarousel>
    )
}
