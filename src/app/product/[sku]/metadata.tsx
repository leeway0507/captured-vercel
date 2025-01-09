import { ProductProps } from '@/types'
import { fetchProduct } from '@/actions/product'
import CatchError from '@/utils/error/handle-fetch-error'

const generateTitle = (product: ProductProps) =>
    `${product.korBrand} ${product.korProductName} | ${product.productId}`
const generateDescription = (product: ProductProps) =>
    `전세계 재고를 찾아 검거하는 캡쳐드! 내가 원하는 그 제품, 캡쳐드에서 먼저 찾아보세요. ${product.brand} ${product.productName} `

export async function productMetaData(product: ProductProps) {
    const title = generateTitle(product)
    const description = generateDescription(product)
    const openGraph = {
        title,
        description,
        url: process.env.OFFICIAL_URL,
        siteName: process.env.SITE_NAME,
        images: `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/product/${product.sku}/resize/main.webp`,
        type: 'website',
    }
    return { title, description, openGraph }
}

export async function JsonLDComponent({ sku }: { sku: string }) {
    const product = await fetchProduct(sku).then(CatchError)
    const name = generateTitle(product)
    const description = generateDescription(product)
    const image = `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/product/${product.sku}/resize/main.webp`

    const jsonLd = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name,
        image,
        description,
        productID: `${product.productId}`,
        brand: {
            '@type': 'Brand',
            name: `${product.brand}`,
        },
        offers: {
            '@type': 'Offer',
            price: `${product.price}`,
            priceCurrency: 'KRW',
            availability:
                product.size && product.size.length > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
        },
    }
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}
