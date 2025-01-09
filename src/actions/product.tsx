'use server'

import { ProductFetchResponseProps, ProductFilterSearchParamsProps, ProductProps } from '../types'
import { convertObjToProductFilter } from '../utils/filter'
import { handleFetchError, HandleFetchErrorResp } from '../utils/error/handle-fetch-error'

export const fetchProduct = async (sku: string): Promise<HandleFetchErrorResp<ProductProps>> => {
    const fetchFn = async () => {
        const url = `${process.env.PRODUCT_API_URL}/api/product/product/${sku}`

        const res = await fetch(url)
        return { status: res.status, data: (await res.json()) as ProductProps }
    }
    return handleFetchError(fetchFn)
}

export const fetchProductList = async (
    searchParams: ProductFilterSearchParamsProps,
): Promise<HandleFetchErrorResp<ProductFetchResponseProps>> => {
    const fetchFn = async () => {
        const { pageNum, productFilter } = convertObjToProductFilter(searchParams)
        const url = `${process.env.PRODUCT_API_URL}/api/product/category?page=${pageNum}`

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: productFilter,
        })
        return { status: res.status, data: (await res.json()) as ProductFetchResponseProps }
    }
    return handleFetchError(fetchFn)
}

export const fetchSearchList = async (
    keyword: string,
): Promise<HandleFetchErrorResp<{ data: ProductProps[] }>> => {
    const url = `${process.env.PRODUCT_API_URL}/api/product/search?keyword=${keyword}`
    const fetchFn = async () => {
        const res = await fetch(url)
        return { status: res.status, data: (await res.json()) as { data: ProductProps[] } }
    }
    return handleFetchError(fetchFn)
}
