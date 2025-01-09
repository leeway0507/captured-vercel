import CategoryLayout from '@/components/banner/category-layout'
import NewestItem from '@/components/banner/newest-item-layout'
import BrandItemsLayOutOne from '@/components/banner/brand-items-layout-one'
import BrandItemsLayOutTwo from '@/components/banner/brand-items-layout-two'
import MainLayout from '@/components/banner/main-layout'
import BrandList from '@/components/banner/brand-layout'
import { Suspense } from 'react'
import Spinner from '@/components/spinner/spinner'
import Nav from '@/components/common/nav'
import Footer from '@/components/common/footer'

export default async function Home() {
    return (
        <>
            <Nav />
            <main className="page-container flex flex-col w-full gap-12 lg:gap-24">
                <MainLayout />
                <Suspense fallback={<Spinner />}>
                    <BrandItemsLayOutOne brandName="arc'teryx" />
                </Suspense>
                <BrandList />
                <Suspense fallback={<Spinner />}>
                    <BrandItemsLayOutOne brandName="adidas originals" />
                </Suspense>
                <Suspense fallback={<Spinner />}>
                    <NewestItem />
                </Suspense>
                <CategoryLayout />
                <Suspense fallback={<Spinner />}>
                    <BrandItemsLayOutTwo brandName="patagonia" />
                </Suspense>
            </main>
            <Footer />
        </>
    )
}
