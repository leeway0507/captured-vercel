import { IntlShippingFee, CurrencyProps, StoreProps } from '@/app/(captured-table)/table/type'
import { roundDigit } from '@/app/(captured-table)/table/(table)/components/utils'
import getData from '@/app/(captured-table)/table/components/fetch/fetch'

export interface StoreTableProps extends StoreProps {
    krw_intl_shipping_fee: IntlShippingFee
    krw_intl_free_shipping_min: number
}

export class Preprocessor {
    currency!: CurrencyProps

    Preprocess(s: StoreProps): StoreTableProps {
        const shippingFee = this.KRWIntlShippingFee(s.intl_shipping_fee, s.currency)
        const intlShippingFeeMin = this.KRWIntlFreeShippingMin(s.intl_free_shipping_min, s.currency)
        return {
            ...s,
            krw_intl_shipping_fee: shippingFee,
            krw_intl_free_shipping_min: intlShippingFeeMin,
        }
    }

    KRWIntlShippingFee(rawShippingFees: IntlShippingFee, currencyCode: string) {
        if (currencyCode === 'KRW') return rawShippingFees
        const shippingFeeArr = Object.values(rawShippingFees)
        const currency = this.currency.buying.Data[currencyCode]
        const v = shippingFeeArr.map((f) => roundDigit(f * currency, 2))
        return {
            Heavy: v[0],
            Light: v[1],
            Shoes: v[2],
        }
    }

    KRWIntlFreeShippingMin(freeShippingFee: number, currencyCode: string) {
        if (currencyCode === 'KRW') return freeShippingFee
        const currency = this.currency.buying.Data[currencyCode]
        return roundDigit(freeShippingFee * currency, 2)
    }
}
async function NewPreprocessor() {
    const inst = new Preprocessor()
    inst.currency = await getData('currency')
    return inst
}

export default NewPreprocessor
