import { ProductFilterSearchParamsProps } from '../types'

export function convertObjToProductFilter(searchParams: ProductFilterSearchParamsProps) {
    let pageNum = '1'

    const modifiedSearchParams = { ...searchParams }

    if ('page' in modifiedSearchParams) {
        pageNum = modifiedSearchParams.page as string
        delete modifiedSearchParams.page
    }

    if ('price' in modifiedSearchParams) {
        const priceString = modifiedSearchParams.price as string
        const priceArr = priceString.split(',').map((d) => Number(d))
        modifiedSearchParams.price = priceArr
    }

    const productFilter = JSON.stringify(modifiedSearchParams)
    return { pageNum, productFilter }
}
