import productMock from '@/__mocks__/product-data-api'
import { renderHook, act } from '@testing-library/react'
import useCart, {
    addToCartFn,
    findProductIndex,
    removeToCartFn,
    increaseQtyFn,
    decreaseQtyFn,
    addNewProductToCart,
} from '@/hooks/data/use-cart'
import { ProductCartProps } from '@/types'

const mockSetCartData = jest.fn()

describe('Product Cart', () => {
    // env 세팅

    const localKey = 'cr_t'
    const product = productMock[0]
    const selectedSize = product.size[0]

    let cart: ProductCartProps[] = []

    const setCart = (newCart: ProductCartProps[]) => {
        cart = newCart
    }

    beforeEach(() => {
        cart = []
        localStorage.removeItem(localKey)
    })

    it('should add a new item to cart', () => {
        addNewProductToCart(cart, setCart, product, selectedSize)
        const expectedResult = [{ product, size: selectedSize, quantity: 1, checked: true }]

        expect(cart).toEqual(expectedResult)
    })
    it('should remove the cart', () => {
        cart = [{ product, size: selectedSize, quantity: 3, checked: true }]

        removeToCartFn(mockSetCartData, product, selectedSize)

        expect(mockSetCartData).toHaveBeenCalledWith(expect.any(Function))
        const stateUpdater = mockSetCartData.mock.calls[0][0]
        const newState = stateUpdater(cart)

        const expectedResult: any = []
        expect(newState).toEqual(expectedResult)
    })

    it('should return product idx', () => {
        cart = [{ product, size: selectedSize, quantity: 1, checked: true }]
        const idx = findProductIndex(cart, product, selectedSize)
        expect(idx).toBe(0)

        const cartDataUpdated = [{ product, size: '123', quantity: 1, checked: true }]
        const idxSecond = findProductIndex(cartDataUpdated, product, selectedSize)
        expect(idxSecond).toBe(-1)
    })

    it('should increase the product quantity', () => {
        cart = [{ product, size: selectedSize, quantity: 1, checked: true }]
        increaseQtyFn(cart, setCart, product, selectedSize)

        const expectedResult = [{ product, size: selectedSize, quantity: 2, checked: true }]
        expect(cart).toEqual(expectedResult)
    })

    it('should decrease the product quantity', () => {
        cart = [{ product, size: selectedSize, quantity: 2, checked: true }]

        // quantity 2 -> 1
        decreaseQtyFn(cart, mockSetCartData, product, selectedSize)

        expect(mockSetCartData).toHaveBeenCalledWith(expect.any(Function))
        const newState1 = mockSetCartData.mock.calls[1][0]

        const expectedResult1 = [{ product, size: selectedSize, quantity: 1, checked: true }]
        expect(newState1).toEqual(expectedResult1)

        // quantity 1 -> remove Product To Cart
        decreaseQtyFn(expectedResult1, mockSetCartData, product, selectedSize)

        expect(mockSetCartData).toHaveBeenCalledWith(expect.any(Function))
        const stateUpdater = mockSetCartData.mock.calls[0][0]
        const newState2 = stateUpdater(expectedResult1)

        const expectedResult2: any = []
        expect(newState2).toEqual(expectedResult2)
    })

    it('should add and update an item to Cart', () => {
        // add a new Items
        addToCartFn(cart, setCart, product, selectedSize)
        const expectedResult = [{ product, size: selectedSize, quantity: 1, checked: true }]
        expect(cart).toEqual(expectedResult)

        // increase the product quantity
        addToCartFn(cart, setCart, product, selectedSize)
        const expectedResultSecond = [{ product, size: selectedSize, quantity: 2, checked: true }]
        expect(cart).toEqual(expectedResultSecond)
    })

    it('should add an item to Cart', () => {
        const { result } = renderHook(() => {
            const { addToCart } = useCart()
            return addToCart
        })

        act(() => result.current(product, selectedSize))

        const cartArr = localStorage.getItem(localKey)
        const expectedResult = [{ product, size: selectedSize, quantity: 1, checked: true }]
        expect(cartArr).toBe(JSON.stringify(expectedResult))
    })
})
