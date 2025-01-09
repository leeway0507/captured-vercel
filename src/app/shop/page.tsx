import dynamic from 'next/dynamic'
import { fetchProductList } from '@/actions/product'
import { ProductFilterSearchParamsProps } from '@/types'
import { Suspense } from 'react'
import Spinner from '@/components/spinner/spinner'
import CatchError from '@/utils/error/handle-fetch-error'
import Filter from './filter'

async function Product({ filterParams }: { filterParams: ProductFilterSearchParamsProps }) {
    const res = await fetchProductList(filterParams).then(CatchError)
    const ProductList = dynamic(() => import('./product-list'), { ssr: false })
    const { page, ...pageParamsWithoutPage } = filterParams
    return <ProductList searchKey={pageParamsWithoutPage} productResponse={res} />
}

async function Page({ searchParams }: { searchParams: ProductFilterSearchParamsProps }) {
    return (
        <div className="mx-auto page-max-frame grow flex flex-col w-full">
            <Suspense>
                <Filter />
            </Suspense>
            <Suspense fallback={<Spinner />}>
                <Product filterParams={searchParams} />
            </Suspense>
        </div>
    )
}

export default Page
