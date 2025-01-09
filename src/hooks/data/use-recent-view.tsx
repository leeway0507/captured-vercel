'use client'

import { saveToLocal, loadFromLocal } from '@/utils/storage'
import { ProductProps } from '@/types'

const localKey = 'rc_v'

const findDuplicateProduct = (product: ProductProps, recentView: ProductProps[]) =>
    recentView.findIndex((p) => p.sku === product.sku)

// 최신순으로 정렬
// 1부터 10 순서로 데이터 삽입 시 결과 [10,9,8,7,6,5,4,3,2,1]
export const addProductToRecentView = (
    maxViewSize: number,
    product: ProductProps,
    recentView: ProductProps[] | undefined,
) => {
    // 최근 항목이 없거나 빈 경우
    const isRecentViewEmpty = !recentView || recentView.length === 0
    if (isRecentViewEmpty) return [product]

    // 신규 recentView 정의
    const updatedRecentView = [...recentView]
    const duplicateProductIndex = findDuplicateProduct(product, recentView)

    // recentView가 정한 사이즈보다 큰 경우
    if (recentView.length >= maxViewSize) {
        if (duplicateProductIndex !== -1) {
            // 중복된 제품 제거
            updatedRecentView.splice(duplicateProductIndex, 1)
        } else {
            updatedRecentView.pop()
        }
        updatedRecentView.unshift(product)
        return updatedRecentView
    }

    // recentView가 정한 사이즈 내 위치한 경우
    if (duplicateProductIndex !== -1) {
        updatedRecentView.splice(duplicateProductIndex, 1)
    }
    return [product, ...updatedRecentView]
}

const useRecentView = (product: ProductProps, maxViewSize: number = 10) => {
    // localStorage에 데이터를 보관하므로 State 관리 불필요
    const prevRecentView = loadFromLocal<ProductProps[]>(localKey)
    const updatedRecentView = addProductToRecentView(maxViewSize, product, prevRecentView)

    if (JSON.stringify(prevRecentView) !== JSON.stringify(updatedRecentView))
        saveToLocal(localKey, updatedRecentView)

    return prevRecentView
}

export default useRecentView
