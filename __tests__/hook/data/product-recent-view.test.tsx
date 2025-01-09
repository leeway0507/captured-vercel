import productMock from '@/__mocks__/product-data-api'
import { loadFromLocal, saveToLocal } from '@/utils/storage'
import { ProductProps } from '@/types'
import useRecentView, { addProductToRecentView } from '@/hooks/data/use-recent-view'

describe('product-recent-view', () => {
    // init Stack

    const localKey = 'rc_v'
    const p = productMock[0]
    beforeEach(() => {
        // init recentView Stack
        saveToLocal(localKey, [])
    })

    it('should return lastRecentView', () => {
        const prevRecentVIew: ProductProps[] = []
        const newProduct = productMock[0]

        const data = addProductToRecentView(10, newProduct, prevRecentVIew)

        expect(data).toEqual([newProduct])
    })

    it('should append data as deque', () => {
        const prevRecentVIew: ProductProps[] = productMock.slice(0, 5)
        const newProduct = productMock[6]

        const result = addProductToRecentView(10, newProduct, prevRecentVIew)
        const data = result.shift()

        expect(data).toEqual(newProduct)
    })
    it('should move the product already existing in deque to last', () => {
        const prevRecentVIew = productMock.slice(0, 10)
        const duplicatedProduct = productMock[6]

        const result = addProductToRecentView(10, duplicatedProduct, prevRecentVIew)
        const arr = result.filter((product) => product.sku === duplicatedProduct.sku)
        expect(arr.length).toBe(1)

        const data = result.shift()
        expect(data).toEqual(duplicatedProduct)
    })

    it('should return prevRecentView.', () => {
        const prevRecentVIew = useRecentView(p, 10)

        expect(prevRecentVIew).toEqual([])
    })

    it('should save lastRecentView from localStorage. ', () => {
        // push to localStorage
        useRecentView(p, 10)

        const data = loadFromLocal(localKey)

        expect(data).toEqual([p])
    })

    it('should return prevRecentView. ', () => {
        const p2 = productMock[1]

        // push to localStorage
        useRecentView(p, 10)

        const prevRecentVIew = useRecentView(p2, 10)

        expect(prevRecentVIew).toEqual([p])
    })

    it('should keep max 10 products.', () => {
        productMock.slice(0, 20).map((prod) => useRecentView(prod, 10))

        const prevRecentView = useRecentView(p)

        expect(prevRecentView!.length).toBe(10)
    })

    it('should use deque', () => {
        productMock.slice(0, 20).map((prod) => useRecentView(prod, 10))
        const prevRecentView = useRecentView(p)

        const expectedResult = productMock.slice(10, 20).toReversed()

        expect(prevRecentView).toEqual(expectedResult)
    })
})
