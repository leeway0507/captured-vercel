'use client'

import React, { useEffect, useState, Suspense } from 'react'
import ServerTable from '@/app/(captured-table)/table/(table)/components/server-table'
import NewPriceCalculator, {
    ProductTableProps,
} from '@/app/(captured-table)/table/(table)/product/price-calculator'
import SearchColumn from './header'
import { ProductProps, FilterResponseProps } from '../../../type'

async function createTableData(data: ProductProps[]): Promise<ProductTableProps[]> {
    const priceCalculator = await NewPriceCalculator()

    return data.map((p) => {
        const calc = priceCalculator.calcAll(p)
        return { ...calc }
    })
}

function Table({ prodData }: { prodData: FilterResponseProps<ProductProps> }) {
    const [tableData, setTableData] = useState<ProductTableProps[]>()

    useEffect(() => {
        const calcPrice = async () => {
            const data: ProductTableProps[] = await createTableData(prodData.data)
            setTableData(data)
        }
        calcPrice()
    }, [prodData])

    const initalSorting = [
        {
            id: 'Brand',
            desc: true,
        },
        {
            id: 'totalPrice',
            desc: true,
        },
    ]

    if (tableData === undefined) return null
    return (
        <Suspense fallback={<div />}>
            <ServerTable
                data={tableData}
                columns={SearchColumn}
                pageCount={prodData.lastPage}
                initalSorting={initalSorting}
            />
        </Suspense>
    )
}

export default Table
