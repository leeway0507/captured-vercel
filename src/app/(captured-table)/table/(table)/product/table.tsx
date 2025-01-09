'use client'

import React, { useEffect, useState, Suspense } from 'react'
import ServerTable from '@/app/(captured-table)/table/(table)/components/server-table'
import ProductColumns from './header'
import { ProductProps, FilterResponseProps } from '../../type'
import NewPriceCalculator, { ProductTableProps } from './price-calculator'

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
            const data: ProductTableProps[] = prodData.data
                ? await createTableData(prodData.data)
                : []
            setTableData(data)
        }
        calcPrice()
    }, [prodData])

    if (tableData === undefined) return null
    return (
        <Suspense fallback={<div />}>
            <ServerTable data={tableData} columns={ProductColumns} pageCount={prodData.lastPage} />
        </Suspense>
    )
}

export default Table
