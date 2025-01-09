import { ProductCartProps } from '../../types'

export const calculateProductPrice = (arr: ProductCartProps[]) =>
    arr?.reduce((result, item) => result + item.product.price * item.quantity, 0)

export const calculateDomeShippingFee = (arr: ProductCartProps[]) =>
    arr?.reduce(
        (result, item) =>
            item.product.intl === false
                ? result + item.product.shippingFee * item.quantity
                : result,
        0,
    )

export const calculateIntlShippingFee = (arr: ProductCartProps[]) =>
    arr?.reduce(
        (result, item) =>
            item.product.intl === true ? result + item.product.shippingFee * item.quantity : result,
        0,
    )

const calcTotalPrice = (arr: ProductCartProps[]) => {
    const totalProductPrice = calculateProductPrice(arr)
    const domeShippingFee = calculateDomeShippingFee(arr)
    const intlShippingFee = calculateIntlShippingFee(arr)

    return { totalProductPrice, domeShippingFee, intlShippingFee }
}

export default calcTotalPrice
