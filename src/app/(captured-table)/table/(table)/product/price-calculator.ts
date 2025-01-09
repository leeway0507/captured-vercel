import {
    StoreProps,
    CurrencyProps,
    ProductProps,
    IntlShippingFee,
} from '@/app/(captured-table)/table/type'
import getData from '../../components/fetch/fetch'
import { EU } from '../../components/meta/country'
import {
    productCat,
    defaultProductType,
    ProductCatProps,
    consumptionTaxStd,
} from '../../components/meta/product'
import { roundDecimal, roundDigit } from '../components/utils'

export type ProductTableProps = {
    productPrice: ProductPriceProps
    deliveryInfo: IntlDeliveryProps
    tax: TaxProps
    productInfo: ProductProps
    productType: ProductCatProps
    storeInfo: StoreProps
}
export type ProductPriceProps = {
    currencyCode: string
    retailPrice: number
    salePrice: number
    taxReducedRetailPrice: number
    taxReducedSalePrice: number
    RetailKRWPrice: number
    KRWPrice: number
    saleRate: number
}
export type IntlDeliveryProps = {
    currencyCode: string
    shippingFee: number
    KRWShippingFee: number
    shippingFeePerPrice: number
    KRWShippingFeePerPrice: number
    numOfProduct: number
    isFreeDelivery: boolean
    isCumulative?: boolean
}
export type TaxProps = {
    totalTax: number
    customTax: number
    VAT: number
    consumptionTax: number
    isCustomDuty: boolean
    freeCustomLimit: number
    custumUSDPirce: number
    IsFTA?: boolean
    brokerFee?: number
}

export class PriceCalculator {
    storeArr!: StoreProps[]
    currency!: CurrencyProps

    calcAll(product: ProductProps): ProductTableProps {
        const store = this.storeArr.find((s) => s.store_name === product.store_name)!
        const productType = this.findProductType(product)
        // 배송
        const productPrice = this.calcProductPrice(product, store)
        const deliveryInfo = this.calcDeliveryPrice([product], store)
        const tax = this.calcTax(productPrice, deliveryInfo, productType!, store, product.mande_in!)
        return {
            productPrice,
            deliveryInfo,
            tax,
            productInfo: product!,
            productType: productType!,
            storeInfo: store,
        }
    }

    calcProductPrice(product: ProductProps, store: StoreProps): ProductPriceProps {
        const taxReducedRetailPrice = this.toTaxReducedPrice(product.retail_price, store)
        const taxReducedSalePrice = this.toTaxReducedPrice(product.sale_price, store)
        const saleRate = roundDecimal(1 - product.sale_price / product.retail_price, 2)
        return {
            currencyCode: product.currency_code,
            retailPrice: product.retail_price,
            salePrice: product.sale_price,
            taxReducedRetailPrice,
            taxReducedSalePrice,
            RetailKRWPrice: this.toKRWPrice(taxReducedRetailPrice, product.currency_code),
            KRWPrice: this.toKRWPrice(taxReducedSalePrice, product.currency_code),
            saleRate,
        }
    }

    calcDeliveryPrice(products: ProductProps[], store: StoreProps): IntlDeliveryProps {
        const totalPrice = products.reduce((total: number, p) => total + p.sale_price, 0)
        const totalTaxReducedPrice = this.toTaxReducedPrice(totalPrice, store)
        const isFreeDelivery = this.isIntlFreeDelivery(
            totalTaxReducedPrice,
            store.intl_free_shipping_min,
        )
        if (isFreeDelivery) {
            return {
                currencyCode: store.currency,
                shippingFee: 0,
                shippingFeePerPrice: 0,
                KRWShippingFee: 0,
                KRWShippingFeePerPrice: 0,
                numOfProduct: products.length,
                isFreeDelivery: true,
            }
        }

        const isCumulative = store.shipping_fee_cumulation
        if (!isCumulative) {
            const fee = store.intl_shipping_fee.Shoes
            const shippingFeePerPrice = roundDecimal(fee / products.length, 2)
            return {
                currencyCode: store.currency,
                shippingFee: fee,
                shippingFeePerPrice,
                KRWShippingFee: this.toKRWPrice(fee, store.currency),
                KRWShippingFeePerPrice: this.toKRWPrice(shippingFeePerPrice, store.currency),
                numOfProduct: products.length,
                isFreeDelivery: false,
                isCumulative: false,
            }
        }

        const totalDeliveryFee = products.reduce(
            (partial, p) => partial + this.intlDeliveryPrice(p, store.intl_shipping_fee),
            0,
        )
        const shippingFeePerPrice = roundDecimal(totalDeliveryFee / products.length, 2)
        return {
            currencyCode: store.currency,
            shippingFee: totalDeliveryFee,
            shippingFeePerPrice,
            KRWShippingFee: this.toKRWPrice(totalDeliveryFee, store.currency),
            KRWShippingFeePerPrice: this.toKRWPrice(shippingFeePerPrice, store.currency),
            numOfProduct: products.length,
            isFreeDelivery: false,
            isCumulative: true,
        }
    }

    isIntlFreeDelivery(taxReducedPrice: number, storeFreeShippingMin: number): boolean {
        if (storeFreeShippingMin === 0) {
            return false
        }
        if (taxReducedPrice >= storeFreeShippingMin) {
            return true
        }
        return false
    }

    intlDeliveryPrice(product: ProductProps, intlShippingFee: IntlShippingFee): number {
        const productType = this.findProductType(product)
        const DeliveryIntlFee = intlShippingFee[productType?.deliveryStd!]
        return DeliveryIntlFee ?? intlShippingFee.Shoes
    }

    calcTax(
        productPrice: ProductPriceProps,
        deliveryInfo: IntlDeliveryProps,
        productType: ProductCatProps,
        store: StoreProps,
        productCountry: string,
    ): TaxProps {
        const custumUSDPirce = this.convertCustomUSD(
            productPrice.taxReducedSalePrice,
            productPrice.currencyCode,
        )
        if (!this.isCustomDuty(custumUSDPirce, store.country)) {
            return {
                totalTax: 0,
                customTax: 0,
                VAT: 0,
                consumptionTax: 0,
                isCustomDuty: false,
                freeCustomLimit: store.country === 'US' ? 200 : 150,
                custumUSDPirce,
            }
        }

        const consumptionTax = (consumptionTaxStd - custumUSDPirce) * productType.consumptionTaxRate
        const custumUSDDelivery = this.convertCustomUSD(
            deliveryInfo.shippingFee,
            deliveryInfo.currencyCode,
        )
        const UsCurrency = this.currency.custom.Data.USD
        const totalKRWPrice = (custumUSDPirce + custumUSDDelivery) * UsCurrency
        const isFTA = this.isFTA(productCountry, store.country)
        const customTax = !isFTA ? totalKRWPrice * productType.customRate : 0
        const VAT = (totalKRWPrice + customTax) * 0.1

        return {
            totalTax: VAT + consumptionTax + customTax,
            customTax,
            VAT,
            consumptionTax,
            isCustomDuty: true,
            IsFTA: !!isFTA,
            brokerFee: store.broker_fee ? 30_000 : 0,
            freeCustomLimit: store.country === 'US' ? 200 : 150,
            custumUSDPirce,
        }
    }

    convertCustomUSD(price: number, currencyCode: string): number {
        if (currencyCode === 'USD') {
            return price
        }
        const currency = this.currency.custom.Data[currencyCode]
        const UsCurrency = this.currency.custom.Data.USD
        const KorPrice = price * currency
        const UsPrice = KorPrice / UsCurrency
        return roundDecimal(UsPrice, 2)
    }
    isFTA(productCountry: string, storeCountry: string): boolean {
        if (productCountry) {
            if (productCountry === storeCountry) {
                return true
            }

            const isStoreInEU = EU.has(storeCountry)
            if (isStoreInEU) {
                const isProductMadeInEU = EU.has(productCountry)
                return isProductMadeInEU
            }
            return false
        }

        return false
    }

    isCustomDuty(USD: number, storeCountry: string): boolean {
        const customLimit = storeCountry === 'US' ? 200 : 150
        return USD >= customLimit
    }

    findProductType(product: ProductProps) {
        const r = productCat.find((p) => p.categorySpec === product.category_spec!)
        return r || defaultProductType
    }

    toTaxReducedPrice(price: number, store: StoreProps) {
        if (store.tax_reduction_manually) {
            return roundDecimal(price / (1 + store.tax_reduction), 2)
        }
        return price
    }

    toKRWPrice(price: number, currencyCode: string): number {
        if (currencyCode === 'KRW') {
            return price
        }
        const currency = this.currency.buying.Data[currencyCode]
        return roundDigit(price * currency, 2)
    }
}

async function NewPriceCalculator() {
    const inst = new PriceCalculator()
    inst.currency = await getData('currency')
    inst.storeArr = await getData('store')
    return inst
}

export default NewPriceCalculator
