import { fetchProductList } from '@/actions/product'
import CatchError from '@/utils/error/handle-fetch-error'
import { ProductCardCarousel, Container, MoreButton } from './_component'

async function NewestItem() {
    const productResponse = await fetchProductList({}).then(CatchError)
    const container = 'w-full bg-gray-100 py-4'
    return (
        <Container className={`${container}`}>
            <section className="layout-max-frame lg:px-4 lg:mx-auto">
                <h1 className="text-lg lg:text-xl px-2 font-medium pb-2">추천 아이템</h1>
                <ProductCardCarousel productArr={productResponse.data} maxItems={10} />
                <MoreButton link="/shop" />
            </section>
        </Container>
    )
}

export default NewestItem
