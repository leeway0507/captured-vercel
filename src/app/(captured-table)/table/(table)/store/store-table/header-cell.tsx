'use client'

import { Avatar, AvatarImage } from '@/app/(captured-table)/table/components/ui/avatar'
import Image from 'next/image'
import { CellContext } from '@tanstack/react-table'
import { IntlShippingFee } from '@/app/(captured-table)/table/type'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import Link from 'next/link'
import { CURR, customHoverCard } from '@/app/(captured-table)/table/(table)/components/utils'
import { KorCurrency, currencySymbol } from '@/app/(captured-table)/table/components/meta/currency'
import { CountryToISO2 } from '../../../components/meta/country'
import { StoreTableProps } from './data-preprocessor'

export default function StoreLogoImage({ storeName }: { storeName: string }) {
    const divClass = 'relative w-[50px] lg:w-[60px] aspect-square flex-center rounded-full border '
    const ImageClass = 'object-contain rounded-full'
    return (
        <div className={`${divClass}`}>
            <Image
                src={`/store/logo/${storeName}.webp`}
                alt={`${storeName}-logo`}
                sizes="100"
                quality={100}
                className={ImageClass}
                width={100}
                height={100}
            />
        </div>
    )
}

export function Store({ p }: { p: CellContext<StoreTableProps, any> }) {
    const store = p.row.original
    return (
        <Link href={store.store_url} target="_blank" rel="noreferrer" className="m-auto ">
            <div className="flex-center flex-col ms-1 gap-2 py-4 hover:bg-accent">
                <div>
                    <StoreLogoImage storeName={store.store_name} />
                </div>
                <div className="grow flex-center">
                    <div className="uppercase ps-2">
                        <div>{store.store_name.replaceAll('_', ' ')}</div>
                        <div className="text-gray-400">{store.kor_store_name}</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
export function Country({ p }: { p: CellContext<StoreTableProps, any> }) {
    const countryCode = p.row.original.country
    const country = CountryToISO2.find((c) => c.countryCode === countryCode)
    return (
        <div className="flex-center gap-2 text-base">
            {country!.countryNameKor}
            <div className="text-2xl">{country!.flag}</div>
        </div>
    )
}
export function TaxReduction({ p }: { p: CellContext<StoreTableProps, any> }) {
    const TaxReductionRate: number | undefined = p.row.original.tax_reduction
    const salePercentFormat = TaxReductionRate?.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 0,
    })

    return TaxReductionRate === undefined ? '0%' : `${salePercentFormat}`
}

function SingleFeeCell(price: number, currency: string) {
    return CURR(price, currency)
}

function MultipleFeeCell(priceArr: number[], currency: string) {
    const [p1, p2, p3] = priceArr
    return (
        <div className="grid grid-cols-2">
            <span>의류1</span>
            {CURR(p1, currency)}
            <span>의류2</span>
            {CURR(p2, currency)}
            <span>신발</span>
            {CURR(p3, currency)}
        </div>
    )
}

export function DeliveryFee({ p }: { p: CellContext<StoreTableProps, any> }) {
    const rawShippingFees: IntlShippingFee = p.getValue()
    const currencyCode = p.row.original.currency
    const shippingFeeArr = Object.values(rawShippingFees)
    const krwShippingFeeArr = Object.values(p.row.original.krw_intl_shipping_fee)

    const singleFee = new Set(shippingFeeArr).size === 1

    return singleFee
        ? customHoverCard(
              SingleFeeCell(krwShippingFeeArr[0], 'KRW'),
              SingleFeeCell(shippingFeeArr[0], currencyCode),
              'right',
          )
        : customHoverCard(
              MultipleFeeCell(krwShippingFeeArr, 'KRW'),
              MultipleFeeCell(shippingFeeArr, currencyCode),
              'right',
          )
}

export function FreeDeliveryFeeMin({ p }: { p: CellContext<StoreTableProps, any> }) {
    const freeShippingFee: number = p.getValue()
    const currencyCode = p.row.original.currency
    const KRWFreeshippingFee = p.row.original.krw_intl_free_shipping_min

    return freeShippingFee !== undefined
        ? customHoverCard(
              SingleFeeCell(KRWFreeshippingFee, 'KRW'),
              SingleFeeCell(freeShippingFee, currencyCode),
              'right',
          )
        : '아니요'
}

export function CurrencyCode({ p }: { p: CellContext<StoreTableProps, any> }) {
    const code: string = p.getValue()
    const korCurrency = KorCurrency[code]
    const symbol = currencySymbol[code]
    return (
        <>
            <div>{korCurrency}</div>
            <div className="text-gray-400">
                {code}({symbol})
            </div>
        </>
    )
}

export function YesOrNo({ p }: { p: CellContext<StoreTableProps, any> }) {
    const isTrue: boolean = p.getValue()
    return isTrue ? '예' : '아니요'
}

export function DeliveryAgency<T>({ p }: { p: CellContext<T, any> }) {
    const s: string = p.getValue()
    const DeliveryAgencyArr = s.split(',')
    const numAgencies = DeliveryAgencyArr.length
    const cell = (
        <div className="flex-center justify-between" key={DeliveryAgencyArr[0]}>
            <Avatar>
                <AvatarImage
                    src={`/delivery_agency/${DeliveryAgencyArr[0].toLowerCase()}.webp`}
                    className="border border-black/20 rounded-full"
                />
            </Avatar>
            <div className="uppercase flex-col items-center grow">
                {DeliveryAgencyArr[0]}
                {numAgencies > 1 ? ` + ${numAgencies - 1}` : null}
            </div>
        </div>
    )
    const hoverCell = (
        <>
            {DeliveryAgencyArr.map((agency) => (
                <div className="flex-center justify-between gap-4 mx-2 py-2" key={agency}>
                    <Avatar>
                        <AvatarImage
                            src={`/delivery_agency/${agency.toLowerCase()}.webp`}
                            className="border border-black/20 rounded-full"
                        />
                    </Avatar>
                    <div className="uppercase flex-col items-center grow">{agency}</div>
                </div>
            ))}
        </>
    )
    return numAgencies ? customHoverCard(cell, hoverCell) : cell
}

export function MoveToSite({ p }: { p: CellContext<StoreTableProps, any> }) {
    return (
        <Button variant="secondary" className="font-medium" asChild>
            <Link href={p.getValue()} target="_blank" rel="noreferrer">
                이동하기
            </Link>
        </Button>
    )
}
