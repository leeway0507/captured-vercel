import { createColumnHelper, ColumnDef, SortingFn } from '@tanstack/react-table'
import { ProductTableProps } from '@/app/(captured-table)/table/(table)/product/price-calculator'
import * as Cell from '@/app/(captured-table)/table/(table)/product/header-cell'
import * as Col from '@/app/(captured-table)/table/(table)/product/header-col'
import LinkSite from './header-cell'

const calcTotalPrice = (row: any) => {
    const productPrice = row.original.productPrice.KRWPrice
    const deliveryInfo = row.original.deliveryInfo.KRWShippingFee
    const tax = row.original.tax.totalTax
    return productPrice + deliveryInfo + tax
}

const customSort: SortingFn<ProductTableProps> = (rowA, rowB): number => {
    const rA = calcTotalPrice(rowA)
    const rB = calcTotalPrice(rowB)
    if (rA > rB) {
        return -1
    }
    if (rA < rB) {
        return 1
    }
    return 0
}

const columnHelper = createColumnHelper<ProductTableProps>()

const SearchColumn: ColumnDef<ProductTableProps, any>[] = [
    columnHelper.accessor('productInfo.product_url', {
        id: 'options',
        header: ({ table }) => <Col.Filter table={table} columnName="필터" />,
        cell: (p) => <LinkSite p={p} />,
    }),

    columnHelper.accessor('productInfo.product_id', {
        id: 'Brand',
        header: ({ column }) => <Col.Brand columnName="브랜드" column={column} />,
        cell: (p) => <Cell.Brand p={p} />,
        sortingFn: 'text',
    }),

    columnHelper.accessor('productInfo.product_img_url', {
        header: '이미지',
        cell: (p) => <Cell.ProductImage p={p} />,
    }),

    columnHelper.accessor('productInfo.retail_price', {
        id: 'totalPrice',
        header: '구매가',
        cell: (p) => <Cell.TotalPrice p={p} />,
        sortingFn: customSort,
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

export default SearchColumn
