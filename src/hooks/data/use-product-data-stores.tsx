'use client'

import { saveToLocal, loadFromLocal } from '@/utils/storage'
import { simpleHash } from '@/utils/simple-hash'
import { ProductDataStoreProps, ProductFetchResponseProps } from '@/types'

export const loadUpdatedProductDataStore = <T,>(
    searchKey: T,
    localProductData: ProductDataStoreProps | undefined,
    ProductFetchResponse: ProductFetchResponseProps,
) => {
    const filterHash = simpleHash(JSON.stringify(searchKey))
    const { data, currentPage, lastPage } = ProductFetchResponse

    // 신규 또는 필터 변경시 초기화
    const initCases = localProductData === undefined || localProductData.filter !== filterHash
    if (initCases)
        return { filter: filterHash, data: { [currentPage]: data }, lastPage: lastPage.toString() }

    // 기존과 변함 없다면
    const pages = Object.keys(localProductData.data)
    const hasPage = pages.find((v) => v === String(currentPage))
    if (hasPage) return localProductData

    // 기존 filter에 페이지만 업데이트 시
    return {
        filter: filterHash,
        data: { ...localProductData.data, [currentPage]: data },
        lastPage: lastPage.toString(),
    }
}

const useProductDataStore = <T,>(searchKey: T, ProductFetchResponse: ProductFetchResponseProps) => {
    const localKey = 'pr_d'
    const prevProductDataStore = loadFromLocal<ProductDataStoreProps>(localKey)
    const updatedProductDataStore = loadUpdatedProductDataStore(
        searchKey,
        prevProductDataStore,
        ProductFetchResponse,
    )

    if (JSON.stringify(prevProductDataStore) !== JSON.stringify(updatedProductDataStore))
        saveToLocal(localKey, updatedProductDataStore)

    return updatedProductDataStore
}

export default useProductDataStore
