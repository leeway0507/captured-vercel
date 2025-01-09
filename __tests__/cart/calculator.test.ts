import calcTotalPrice, {
    calculateProductPrice,
    calculateDomeShippingFee,
    calculateIntlShippingFee,
} from '@/components/order/calculate-price'

import productMock from '@/__mocks__/product-data-api'

describe('Price Calculation', () => {
    const mockData = [
        { product: productMock[0], quantity: 1, size: '240', checked: true },
        { product: productMock[1], quantity: 2, size: '235', checked: true },
        { product: productMock[2], quantity: 3, size: '230', checked: true },
        { product: productMock[3], quantity: 3, size: '230', checked: false },
    ]

    // calc only checked
    const expectedProductPrice =
        mockData[0].product.price * mockData[0].quantity +
        mockData[1].product.price * mockData[1].quantity +
        mockData[2].product.price * mockData[2].quantity

    // calc only checked
    const expectedIntlFeeResult =
        mockData[0].product.shippingFee * mockData[0].quantity +
        mockData[1].product.shippingFee * mockData[1].quantity +
        mockData[2].product.shippingFee * mockData[2].quantity

    const expectedDomeResult = 0

    it('should calculate total product price', () => {
        const checkedArr = mockData.filter((p) => p.checked)
        const data = calculateProductPrice(checkedArr)

        expect(data).toBe(expectedProductPrice)
    })

    it('should calculate total intl fee ', () => {
        const checkedArr = mockData.filter((p) => p.checked)
        const data = calculateIntlShippingFee(checkedArr)
        expect(data).toBe(expectedIntlFeeResult)
    })

    it('should calculate total dome fee', () => {
        const data = calculateDomeShippingFee(mockData)
        expect(data).toBe(expectedDomeResult)
    })

    it('should calculate ', () => {
        const checkedArr = mockData.filter((p) => p.checked)
        const { totalProductPrice, domeShippingFee, intlShippingFee } = calcTotalPrice(checkedArr)
        expect(totalProductPrice).toBe(expectedProductPrice)
        expect(domeShippingFee).toBe(expectedDomeResult)
        expect(intlShippingFee).toBe(expectedIntlFeeResult)
    })
})
