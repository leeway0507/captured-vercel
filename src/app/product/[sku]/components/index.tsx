'use client'

import dynamic from 'next/dynamic'
import { ProductProps } from '@/types'
import * as Prod from './layer'

const RecentView = dynamic(() => import('./recent-view'), { ssr: false })

function Product({ product }: { product: ProductProps }) {
    return (
        <>
            <Prod.Container>
                <Prod.ImageLayer product={product} />
                <Prod.InfoLayout>
                    <Prod.SpecBox product={product} />
                    <Prod.SizeSelectionBox product={product} />
                    <Prod.ShipmentInfo product={product} />
                    <Prod.PolicyInfo />
                </Prod.InfoLayout>
            </Prod.Container>
            <RecentView product={product} />
        </>
    )
}

export default Product
