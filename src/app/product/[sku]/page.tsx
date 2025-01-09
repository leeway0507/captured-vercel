import { fetchProduct } from '@/actions/product'
import { Suspense } from 'react'
import Spinner from '@/components/spinner/spinner'
import CatchError from '@/utils/error/handle-fetch-error'
import { productMetaData, JsonLDComponent } from './metadata'
import Product from './components'

interface ParamsProps {
    sku: string
}

export async function generateMetadata({ params }: { params: ParamsProps }) {
    const product = await fetchProduct(params.sku).then(CatchError)
    return productMetaData(product)
}

async function ProductWrapper({ sku }: { sku: string }) {
    const product = await fetchProduct(sku).then(CatchError)
    return <Product product={product} />
}

async function Page({ params }: { params: ParamsProps }) {
    const { sku } = params
    return (
        <>
            <Suspense>
                <JsonLDComponent sku={sku} />
            </Suspense>

            <Suspense fallback={<Spinner />}>
                <ProductWrapper sku={sku} />
            </Suspense>
        </>
    )
}

export default Page
