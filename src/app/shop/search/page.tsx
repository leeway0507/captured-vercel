import { fetchSearchList } from '@/actions/product'
import { Suspense } from 'react'
import Spinner from '@/components/spinner/spinner'
import CatchError from '@/utils/error/handle-fetch-error'
import SearchList, { NoSearchData } from './search'

async function Search({ searchParams }: { searchParams: { keyword: string } }) {
    const { data } = await fetchSearchList(searchParams.keyword).then(CatchError)
    return data.length > 0 ? <SearchList data={data} /> : <NoSearchData />
}

async function Page({ searchParams }: { searchParams: { keyword: string } }) {
    const { keyword } = searchParams
    return (
        <div className="mx-auto page-max-frame grow flex flex-col w-full">
            <h1 className="text-2xl md:text-3xl text-center font-medium py-8">
                {keyword && `${keyword}에 대한 검색 결과`}
            </h1>
            <Suspense fallback={<Spinner />}>
                <Search searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

export default Page
