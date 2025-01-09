import { createColumnHelper, ColumnDef, SortingFn } from '@tanstack/react-table'
import * as Cell from '@/app/(captured-table)/table/(table)/product/header-cell'
import * as Col from '@/app/(captured-table)/table/(table)/product/header-col'
import { CostCell, MarginCell } from './header-cell'
import { FavoriteTableProps } from './margin-calculator'
import LinkSite from '../../search/search-table/header-cell'
import Filter from './header-col'

const calcTotalPrice = (row: any) => {
    const productPrice = row.original.productPrice.KRWPrice
    const deliveryInfo = row.original.deliveryInfo.KRWShippingFee
    const tax = row.original.tax.totalTax
    return productPrice + deliveryInfo + tax
}

const customSort: SortingFn<FavoriteTableProps> = (rowA, rowB): number => {
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

const columnHelper = createColumnHelper<FavoriteTableProps>()

const SearchColumn: ColumnDef<FavoriteTableProps, any>[] = [
    columnHelper.accessor('productInfo.product_url', {
        id: 'options',
        header: () => <Filter />,
        cell: (p) => <LinkSite p={p} />,
    }),

    columnHelper.accessor('productInfo.product_id', {
        id: 'Brand',
        header: ({ column }) => <Col.Brand columnName="브랜드" column={column} />,
        cell: (p) => <Cell.Brand p={p} />,
        sortingFn: 'text',
    }),

    columnHelper.accessor('productInfo.product_img_url', {
        id: 'ProductImage',
        header: '이미지',
        cell: (p) => <Cell.ProductImage p={p} />,
    }),

    columnHelper.accessor('RetailPrice', {
        id: 'productMargin',
        header: '판매가/마진',
        cell: (p) => <MarginCell p={p} />,
        sortingFn: customSort,
    }),

    columnHelper.accessor('cost', {
        id: 'cost',
        header: '총 비용',
        cell: (p) => <CostCell p={p} className="font-light text-gray-400" />,
    }),

    columnHelper.accessor('productInfo.retail_price', {
        id: 'totalPrice',
        header: '물품비',
        cell: (p) => <Cell.TotalPrice p={p} className="font-light text-gray-400" />,
        sortingFn: customSort,
    }),
    columnHelper.accessor((row) => row.VAT + row.commission, {
        id: 'commission',
        header: '기타',
        cell: (p) => <CostCell p={p} className="font-light text-gray-400" />,
    }),

    columnHelper.accessor('storeInfo', {
        id: 'store',
        header: ({ column }) => <Col.Store columnName="판매 편집샵" column={column} />,
        cell: (p) => <Cell.Store p={p} />,
    }),
]

export default SearchColumn
