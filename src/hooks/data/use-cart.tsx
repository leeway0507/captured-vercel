'use client'

import { useEffect, useState } from 'react'
import { saveToLocal, loadFromLocal } from '@/utils/storage'
import { ProductProps, ProductCartProps } from '@/types'

// localStorage 저장에 사용되는 key
const localKey = process.env.NEXT_PUBLIC_CART_LOCAL_STORAGE_KEY!

// 기존 리스트에 동일 제품 & 동일 사이즈가 존재하는지 확인하고 idx 반환
export const findProductIndex = (
    cartData: ProductCartProps[],
    product: ProductProps,
    selectedSize: string,
) => cartData.findIndex((d) => d.product.sku === product.sku && d.size === selectedSize)

// 기존 리스트에 동일 제품 & 동일 사이즈가 존재하면, 수량 1 증가
const updateProductQty = (
    updateType: 'increase' | 'decrease',
    cartData: ProductCartProps[],
    idx: number,
    setCartData: (a: ProductCartProps[]) => void,
) => {
    const obj = {
        increase: cartData[idx].quantity + 1,
        decrease: cartData[idx].quantity - 1,
    }
    const updatedCartData = [
        ...cartData.slice(0, idx),
        { ...cartData[idx], quantity: obj[updateType] },
        ...cartData.slice(idx + 1),
    ]
    return setCartData(updatedCartData)
}

export const increaseQtyFn = (
    cartData: ProductCartProps[],
    setCartData: (a: ProductCartProps[]) => void,
    product: ProductProps,
    selectedSize: string,
) => {
    const idx = findProductIndex(cartData, product, selectedSize)
    updateProductQty('increase', cartData, idx, setCartData)
}

// 기존 리스트에 동일 제품 & 동일 사이즈가 존재하지 않으면 신규 추가
export const addNewProductToCart = (
    cartData: ProductCartProps[],
    setCartData: (a: ProductCartProps[]) => void,
    product: ProductProps,
    selectedSize: string,
) => {
    const newProduct = { product, size: selectedSize, quantity: 1, checked: true }
    return setCartData([...cartData, newProduct])
}

// 카트 리스트에 제품 추가
export const addToCartFn = (
    cartData: ProductCartProps[] | undefined,
    setCartData: (a: ProductCartProps[]) => void,
    product: ProductProps,
    selectedSize: string,
) => {
    // cartData undefined
    if (!cartData) return addNewProductToCart([], setCartData, product, selectedSize)

    // product && size already in cart
    const idx = findProductIndex(cartData, product, selectedSize)
    if (idx !== -1) return updateProductQty('increase', cartData, idx, setCartData)

    // add new product to cart
    return addNewProductToCart(cartData, setCartData, product, selectedSize)
}

export const removeToCartFn = (
    setCartData: React.Dispatch<React.SetStateAction<ProductCartProps[] | undefined>>,
    product: ProductProps,
    selectedSize: string,
) =>
    setCartData((old) => {
        const idx = findProductIndex(old!, product, selectedSize)
        return [...old!.slice(0, idx), ...old!.slice(idx + 1)]
    })

export const decreaseQtyFn = (
    cartData: ProductCartProps[],
    setCartData: React.Dispatch<React.SetStateAction<ProductCartProps[] | undefined>>,
    product: ProductProps,
    selectedSize: string,
) => {
    const idx = findProductIndex(cartData, product, selectedSize)
    const target = { ...cartData[idx] }

    if (target.quantity < 2) {
        removeToCartFn(setCartData, target.product, target.size)
    } else {
        updateProductQty('decrease', cartData, idx, setCartData)
    }
}

export const toggleCheckStateFn = (
    cartData: ProductCartProps[],
    setCartData: React.Dispatch<React.SetStateAction<ProductCartProps[] | undefined>>,
    product: ProductProps,
    selectedSize: string,
) => {
    const idx = findProductIndex(cartData, product, selectedSize)

    const updatedCartData = [
        ...cartData.slice(0, idx),
        { ...cartData[idx], checked: !cartData[idx].checked },
        ...cartData.slice(idx + 1),
    ]
    return setCartData(updatedCartData)
}

export interface CartProps {
    cartData: ProductCartProps[] | undefined
    addToCart: (product: ProductProps, selectedSize: string) => void
    removeToCart: (product: ProductProps, selectedSize: string) => void
    increaseQty: (product: ProductProps, selectedSize: string) => void
    decreaseQty: (product: ProductProps, selectedSize: string) => void
    toggleCheckState: (product: ProductProps, selectedSize: string) => void
    initCart: () => void
}

const useCart = () => {
    const [cartData, setCartData] = useState<ProductCartProps[]>()

    useEffect(() => {
        const cartArr = loadFromLocal<ProductCartProps[]>(localKey)
        setCartData(cartArr || [])
    }, [])

    useEffect(() => {
        if (cartData) saveToLocal(localKey, cartData)
    }, [cartData])

    const addToCart = (product: ProductProps, selectedSize: string) => {
        addToCartFn(cartData, setCartData, product, selectedSize)
    }
    const removeToCart = (product: ProductProps, selectedSize: string) => {
        removeToCartFn(setCartData, product, selectedSize)
    }

    const increaseQty = (product: ProductProps, selectedSize: string) => {
        increaseQtyFn(cartData!, setCartData, product, selectedSize)
    }
    const decreaseQty = (product: ProductProps, selectedSize: string) => {
        decreaseQtyFn(cartData!, setCartData, product, selectedSize)
    }
    const toggleCheckState = (product: ProductProps, selectedSize: string) => {
        toggleCheckStateFn(cartData!, setCartData, product, selectedSize)
    }

    const initCart = () => {
        window.localStorage.removeItem(localKey)
    }
    return {
        cartData,
        addToCart,
        removeToCart,
        increaseQty,
        decreaseQty,
        toggleCheckState,
        initCart,
    }
}

export default useCart
