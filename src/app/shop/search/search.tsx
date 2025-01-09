'use client'

import { ProductProps } from '@/types'
import { ProductCard } from '@/components/product/product-card'
import { ProductCardGrid } from '../product-list'

export default function SearchList({ data }: { data: ProductProps[] }) {
    return (
        <ProductCardGrid>
            {data.map((product) => (
                <ProductCard product={product} key={product.sku} />
            ))}
        </ProductCardGrid>
    )
}

export function NoSearchData() {
    return (
        <div className="flex flex-col mx-auto h-full grow lg:p-4 ">
            <div className="text-xl lg:text-2xl pb-2 m-auto">요청 결과가 존재하지 않습니다.</div>
        </div>
    )
}
