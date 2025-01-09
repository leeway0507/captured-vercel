import React from 'react'
import { NavDefault } from '@/app/(captured-table)/table/components/nav/main'
import { Metadata } from 'next'
import getData from '../../components/fetch/fetch'
import { StoreProps } from '../../type'
import StoreTable from './store-table/table'

export const metadata: Metadata = {
    title: '편집샵',
}

export const dynamic = 'force-dynamic'

export default async function Home() {
    const storeData = await getData<StoreProps[]>('store')
    return (
        <>
            <NavDefault />
            <StoreTable storeData={storeData} />
        </>
    )
}
