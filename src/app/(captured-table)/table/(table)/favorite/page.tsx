import React from 'react'
import { NavDefault } from '@/app/(captured-table)/table/components/nav/main'
import { Metadata } from 'next'
import Table from './favorite-table/table'
import FavoriteContext from './context'

export const metadata: Metadata = {
    title: '보관함',
}

export const dynamic = 'force-dynamic'

export default async function Page() {
    return (
        <>
            <NavDefault />
            <FavoriteContext>
                <Table />
            </FavoriteContext>
        </>
    )
}
