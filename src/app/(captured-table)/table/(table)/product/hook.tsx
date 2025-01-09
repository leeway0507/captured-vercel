'use client'

import { useEffect, useState } from 'react'
import { StoreProps } from '@/app/(captured-table)/table/type'

export type ProductFilterMeta = {
    storeName: StoreProps[]
    brand: string[]
}

export function GetProductFilterMeta(): ProductFilterMeta | undefined {
    const [productFilter, setProductFilter] = useState<ProductFilterMeta>()

    useEffect(() => {
        async function f() {
            const reqUrl = new URL('table/api/product/filter-meta', window.location.origin)
            const r = await fetch(reqUrl.href)
            const x = await r.json()
            setProductFilter(x)
        }
        f()
    }, [])
    return productFilter
}
