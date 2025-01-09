import React, { HTMLAttributes } from 'react'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import Link from 'next/link'
import { CellContext } from '@tanstack/react-table'
import { ProductTableProps } from '@/app/(captured-table)/table/(table)/product/price-calculator'
import { KRW } from '@/app/(captured-table)/table/(table)/components/utils'
import Favorite from '../../product/favorite-cell'
import { FavoriteTableProps } from './margin-calculator'

type FavoriteCellProps = HTMLAttributes<HTMLDivElement> & {
    p: CellContext<FavoriteTableProps, any>
}

export function LinkSite({ p }: { p: CellContext<ProductTableProps, any> }) {
    const url = p.row.original.productInfo.product_url
    return (
        <div className="flex flex-col gap-2">
            <Button variant="secondary" className="font-medium" asChild>
                <Link href={url} target="_blank" rel="noreferrer">
                    사이트 이동
                </Link>
            </Button>
            <Favorite p={p} />
        </div>
    )
}
export function MarginCell({ p, ...rest }: FavoriteCellProps) {
    const price = p.getValue()
    const { cost } = p.row.original

    return (
        <div {...rest}>
            <div>{KRW(price)}</div>
            <div className="text-green-600 text-xs pt-1">({KRW(price - cost!)})</div>
        </div>
    )
}

export function CostCell({ p, ...rest }: FavoriteCellProps) {
    const price = p.getValue()
    return <div {...rest}>{KRW(price)}</div>
}
