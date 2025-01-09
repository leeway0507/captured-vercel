'use client'

import React, { useEffect, useState, Suspense } from 'react'
import ServerTableFixed from '@/app/(captured-table)/table/(table)/components/server-table-fixed'
import { decodeHex } from '@/app/(captured-table)/table/utils'
import { ProductTableProps } from '@/app/(captured-table)/table/(table)/product/price-calculator'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import { useRouter } from 'next/navigation'
import SearchColumn from './header'
import MarginCalculator, { FavoriteTableProps } from './margin-calculator'
import { useFavorite } from '../context'

function NoFavorite() {
    const router = useRouter()
    return (
        <div className="flex-col flex-center grow py-8 gap-4">
            <span className="text-2xl">즐겨찾기 제품이 없습니다.</span>
            <Button type="button" aria-label="goBack" asChild={false} onClick={router.back}>
                돌아가기
            </Button>
        </div>
    )
}

function Table() {
    const [tableData, setTableData] = useState<FavoriteTableProps[] | null>()
    const { getFavoriteOptions } = useFavorite()

    useEffect(() => {
        if (!getFavoriteOptions) return

        const s = localStorage.getItem('f_rd')
        const favoliteData: ProductTableProps[] | null = s && JSON.parse(decodeHex(s))

        const marginCalculator = new MarginCalculator()
        setTableData(
            favoliteData ? marginCalculator.execute(favoliteData, getFavoriteOptions) : null,
        )
    }, [getFavoriteOptions])

    if (tableData === undefined) return null
    if (getFavoriteOptions === undefined) return null
    if (tableData === null || tableData?.length === 0) return <NoFavorite />

    const columnPin = [
        {
            id: 'ProductImage',
            start: 0,
            zindex: 10,
        },
        {
            id: 'productMargin',
            start: 205,
            zindex: 0,
        },
    ]
    return (
        <Suspense fallback={<div />}>
            <ServerTableFixed
                data={tableData}
                columns={SearchColumn}
                pageCount={1}
                columnPin={columnPin}
            />
        </Suspense>
    )
}

export default Table
