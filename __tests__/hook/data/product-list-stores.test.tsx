import productMock from '@/__mocks__/product-data-api'
import { renderHook, render, waitFor } from '@testing-library/react' // React v18 이후
import { useState, useEffect } from 'react'
import { saveToLocal, loadFromLocal } from '@/utils/storage'
import useProductDataStore, { updateProductDataStore } from '@/hooks/data/use-product-data-stores'
import { simpleHash } from '@/utils/simple-hash'
import { ProductDataStoreProps } from '@/types'

describe('product-store', () => {
    const filterParams = { brand: 'a,b', page: 'c' }

    it('convert filter to hash', () => {
        const result = simpleHash(JSON.stringify(filterParams))
        expect(result).toEqual('0zbw8b2')
    })

    describe('test checkAndpdate', () => {
        const localKey = 'test'
        const mockData = productMock.slice(0, 1)
        const productResponse = { data: mockData, currentPage: 1, lastPage: 5 }

        it('init load', () => {
            // test check and update
            const { result } = renderHook(() => {
                const [productData, setProductData] = useState<ProductDataStoreProps>()

                useEffect(() => {
                    const prevProductDataStore = loadFromLocal<ProductDataStoreProps>(localKey)
                    const productDataStore = updateProductDataStore(
                        filterParams,
                        prevProductDataStore,
                        productResponse,
                    )
                    setProductData(productDataStore)
                }, [])

                return productData
            })

            expect(simpleHash(JSON.stringify(filterParams))).toEqual(result.current?.filter)
            expect({ 1: mockData }).toEqual(result.current?.data)
            expect('5').toEqual(result.current?.lastPage)
        })

        it('update data to localStorage when unmounting', async () => {
            function UnmountComponent() {
                // useEffect return 기능 체크
                const useProductDataStoreTest = () => {
                    const [, setProductData] = useState<ProductDataStoreProps>()

                    useEffect(() => {
                        const prevProductDataStore = loadFromLocal<ProductDataStoreProps>(localKey)
                        const productDataStore = updateProductDataStore(
                            filterParams,
                            prevProductDataStore,
                            productResponse,
                        )
                        setProductData(productDataStore)

                        return () => {
                            saveToLocal(localKey, productDataStore)
                        }
                    }, [])
                }

                useProductDataStoreTest()
                return <div />
            }

            const { unmount } = render(<UnmountComponent />)
            await waitFor(() => {
                unmount()
            })

            const localData = loadFromLocal<ProductDataStoreProps>(localKey)
            expect({ 1: mockData }).toEqual(localData!.data)
            expect('5').toEqual(localData!.lastPage)
        })

        it('load data from localStorage when filter and page exist in data', () => {
            const localData = loadFromLocal<ProductDataStoreProps>(localKey)

            const { result } = renderHook(() => {
                const productData = useProductDataStore(filterParams, productResponse)
                return productData
            })

            expect(localData!.filter).toEqual(result.current?.filter)
            expect(localData!.data).toEqual(result.current?.data)
        })

        it('update data when a page changed', () => {
            const newMockData = productMock.slice(1, 2)
            const secondPageResponse = { data: newMockData, currentPage: 2, lastPage: 5 }

            const { result } = renderHook(() => {
                const productData = useProductDataStore(filterParams, secondPageResponse)
                return productData
            })

            expect(simpleHash(JSON.stringify(filterParams))).toEqual(result.current?.filter)
            expect({ 1: mockData, 2: newMockData }).toEqual(result.current?.data)
            expect('5').toEqual(result.current?.lastPage)
        })
    })
})
