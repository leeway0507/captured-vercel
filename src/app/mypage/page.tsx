import { Suspense } from 'react'
import Spinner from '@/components/spinner/spinner'

import Mypage from './components'

async function Page({ searchParams }: { searchParams: any }) {
    return (
        <div className="mx-auto page-max-frame flex items-center flex-col  px-2 md:px-0">
            <Suspense fallback={<Spinner />}>
                <Mypage {...searchParams} />
            </Suspense>
        </div>
    )
}

export default Page
