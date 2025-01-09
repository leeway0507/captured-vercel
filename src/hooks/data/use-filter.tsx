'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductFilterParamsProps } from '@/types'

export const getFilterParams = (): ProductFilterParamsProps | undefined => {
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        const { searchParams } = url

        searchParams.delete('page')

        // Use reduce to convert the search parameters into an object
        const filterParams = Array.from(searchParams.entries()).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: value.split(',') }),
            {},
        )
        return filterParams
    }
    return undefined
}

export const useFilterParams = () => {
    const router = useRouter()
    const [filterState, setFilterState] = useState<ProductFilterParamsProps>(
        getFilterParams() || {},
    )

    useEffect(() => {
        const searchParams = getFilterParams() || {}
        const prevCat = filterState.category && filterState.category[0]
        const currCat = searchParams.category && searchParams.category[0]

        if (prevCat !== currCat) {
            const reInitState = currCat ? { category: searchParams.category } : {}
            setFilterState(reInitState)
        }
    })

    const applyFilterToURL = () => {
        if (filterState) {
            const urlWithoutSearchParams = window.location.href.split('?')[0]
            const newURL = new URL(urlWithoutSearchParams)

            // update SearchParams
            Object.entries(filterState).map(([k, v]) => newURL.searchParams.set(k, v.join()))
            router.push(newURL.href, { scroll: false })
        }
    }
    const resetFilterState = () => {
        if (filterState) {
            const searchParams = getFilterParams() || {}
            setFilterState(searchParams)
        }
        return { filterState, setFilterState, applyFilterToURL, resetFilterState }
    }

    return { filterState, setFilterState, applyFilterToURL, resetFilterState }
}

// filter CategoryType
type CategoryType = '의류' | '신발' | '전체' | '기타'
const VALID_CATEGORY_TYPES: CategoryType[] = ['의류', '신발', '전체', '기타']

const isCategoryType = (categoryType: string): categoryType is CategoryType =>
    VALID_CATEGORY_TYPES.includes(categoryType as CategoryType)

export const useCategoryType = (): CategoryType => {
    const searchParams = useSearchParams()
    const CategoryType = searchParams.get('category')

    return CategoryType && isCategoryType(CategoryType) ? (CategoryType as CategoryType) : '전체'
}
