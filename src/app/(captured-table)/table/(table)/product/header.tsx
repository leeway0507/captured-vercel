import { createColumnHelper, ColumnDef } from '@tanstack/react-table'
import { ProductTableProps } from './price-calculator'
import * as Cell from './header-cell'
import * as Col from './header-col'

const columnHelper = createColumnHelper<ProductTableProps>()

const ProductColumns: ColumnDef<ProductTableProps, any>[] = [
    columnHelper.display({
        id: 'options',
        header: ({ table }) => <Col.Filter table={table} columnName="필터" />,
        cell: (p) => <Cell.Comparison p={p} />,
    }),

    columnHelper.accessor('productInfo.product_id', {
        id: 'Brand',
        header: ({ column }) => <Col.Brand columnName="브랜드" column={column} />,
        cell: (p) => <Cell.Brand p={p} />,
        maxSize: 50,
    }),

    columnHelper.accessor('productInfo.product_img_url', {
        id: 'image',
        header: '이미지',
        cell: (p) => <Cell.ProductImage p={p} />,
    }),

    columnHelper.display({
        id: 'totalPrice',
        header: '구매가',
        cell: (p) => <Cell.TotalPrice p={p} />,
    }),

    columnHelper.accessor('productPrice.KRWPrice', {
        header: () => <Col.DefualtHeader columnName="가격" />,
        cell: (p) => <Cell.ProductPrice p={p} />,
    }),

    columnHelper.accessor('deliveryInfo.KRWShippingFee', {
        header: () => <Col.DefualtHeader columnName="배송비" />,
        cell: (p) => <Cell.Delivery p={p} />,
    }),

    columnHelper.accessor('tax.totalTax', {
        header: () => <Col.DefualtHeader columnName="관·부가세" />,
        cell: (p) => <Cell.Tax p={p} />,
    }),

    columnHelper.accessor('storeInfo', {
        header: ({ column }) => <Col.Store columnName="판매 편집샵" column={column} />,
        cell: (p) => <Cell.Store p={p} />,
    }),
]

export default ProductColumns
