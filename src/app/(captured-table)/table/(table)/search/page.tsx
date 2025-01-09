import React from 'react'
import { NavDefault } from '@/app/(captured-table)/table/components/nav/main'
import Table from './search-table/table'
import getData from '../../components/fetch/fetch'
import { ProductProps, SearchResponseProps } from '../../type'
import buildUrl from '../../components/fetch/build-url'

type SearchParamsProps = {
    q: string
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParamsProps }) {
    return {
        title: `'${searchParams.q}'에 대한 검색 결과`,
    }
}
export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: SearchParamsProps }) {
    const url = buildUrl('product/search', searchParams)
    const prodData = await getData<SearchResponseProps<ProductProps>>(url)

    return (
        <>
            <NavDefault value={searchParams.q} />
            <div className="grow flex ">
                {prodData && prodData.data ? (
                    <Table prodData={prodData} />
                ) : (
                    <div className="flex-center text-2xl h-full m-auto">검색 결과가 없습니다.</div>
                )}
            </div>
        </>
    )
}
