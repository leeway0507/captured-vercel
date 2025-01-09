import { fetchProductList } from '@/actions/product'
import CatchError from '@/utils/error/handle-fetch-error'
import { ProductCardArr, Container, FixedCardTitle } from './_component'

export default async function BrandItemsLayOut({
    brandName,
    maxItems = 6,
}: {
    brandName: string
    maxItems?: number
}) {
    const filter = {
        sortBy: '최신순',
        brand: brandName,
    }

    const data = await fetchProductList(filter)
        .then(CatchError)
        .then((res) => res.data)
    const container =
        'mx-auto w-full layout-max-frame flex flex-col gap-2 md:grid md:auto-cols-auto md:grid-flow-col md:px-4 px-1 '

    const productCardBox =
        'grid grid-cols-2 xl:grid-cols-3 xl:px-2 gap-2 place-content-between space-y-4'
    return (
        <Container className={`${container}`}>
            <section className="w-full max-w-[400px] md:max-w-[600px] 2xl:max-w-[650px]">
                <FixedCardTitle
                    src={`/layout/${brandName}.webp`}
                    href={`/shop/?brand=${brandName}`}
                    name={brandName}
                />
            </section>

            <section className={`${productCardBox}`}>
                <ProductCardArr
                    data={data}
                    className="[&:nth-child(n+5)]:hidden xl:[&:nth-child(n+5)]:flex"
                    maxItems={maxItems}
                />
            </section>
        </Container>
    )
}
