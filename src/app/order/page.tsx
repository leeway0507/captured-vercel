import { Suspense } from 'react'
import Spinner from '@/components/spinner/spinner'
import Order from './components'

async function Page() {
    return (
        <div className="max-w-5xl h-full pt-2 md:pt-10 mx-auto">
            <Suspense fallback={<Spinner />}>
                <Order />
            </Suspense>
        </div>
    )
}

export default Page
