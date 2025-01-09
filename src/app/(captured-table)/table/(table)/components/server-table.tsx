'use client'

import { useState, useEffect, useMemo } from 'react'
import {
    ColumnDef,
    flexRender,
    getSortedRowModel,
    getCoreRowModel,
    ColumnFiltersState,
    useReactTable,
    PaginationState,
    ColumnSort,
    TableMeta,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/(captured-table)/table/components/ui/table'
import { useSearchParams, useRouter } from 'next/navigation'
import DataTablePagination from '@/app/(captured-table)/table/(table)/components/pagination'
import {
    ConvertFilterToQueryString,
    ConvertPageToQueryString,
} from '@/app/(captured-table)/table/(table)/components/server-filter'
import cn from '@/utils/cn'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pageCount: number
    initalSorting?: ColumnSort[]
    meta?: TableMeta<TData>
}

type ColumnFilterProps = {
    storeInfo: string[]
    brand: string[]
}

function ServerTable<TData, TValue>({
    columns,
    data,
    pageCount = 1,
    initalSorting = [],
    meta = {},
}: DataTableProps<TData, TValue>) {
    const router = useRouter()

    const searchParams = useSearchParams()
    const pageParam = Number(searchParams.get('page'))
    const pageIndex = pageParam > 1 ? pageParam - 1 : 0
    const pageSize = Number(searchParams.get('limit') ?? '10')
    const filters = searchParams.get('filter')

    const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize])
    const columnFilters = useMemo(() => {
        const v: ColumnFilterProps = JSON.parse(filters ?? '{}')
        return Object.entries(v).map((k) => ({ id: k[0], value: k[1] }))
    }, [filters])

    // onPaginationChange => setNewPage => Router => New Data Load => New DataTable
    const [newPage, setNewPage] = useState<PaginationState>(pagination)
    const [newColumnFilters, setNewColumnFilters] = useState<ColumnFiltersState>(columnFilters)

    const table = useReactTable({
        data,
        columns,
        meta,
        manualPagination: true,
        pageCount,
        enableMultiSort: true,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setNewPage,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setNewColumnFilters,
        defaultColumn: {
            minSize: 100,
        },
        state: {
            columnFilters,
            pagination,
        },

        initialState: {
            pagination: {
                pageSize: 10,
            },
            sorting: initalSorting,
        },
    })

    // 필터링 & 페이지 이동 시 URL 변경
    useEffect(() => {
        const newUrl = new URL(window.location.href)
        ConvertPageToQueryString(newUrl, newPage)
        ConvertFilterToQueryString(newUrl, newColumnFilters)
        router.push(newUrl.href, { scroll: false })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPage, newColumnFilters])

    if (table.getRowModel().rows === undefined) return null

    // 높이 맞추기 위해 pt-[10px] 추가
    return (
        <div className="text-sm overflow-auto lg:overflow-clip mx-auto relative md:min-w-md page-max-frame w-full pt-[10px]">
            <div className="w-full rt-tbody">
                <Table>
                    <TableHeader className="lg:z-50 whitespace-nowrap sticky top-0 lg:top-[80px]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={cn('min-w-[10px] text-center')}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {table.getRowModel().rows?.length ? (
                        <TableBody className="border">
                            {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                'min-w-[10px] text-center bg-white whitespace-nowrap',
                                            )}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : null}
                </Table>
                {table.getRowModel().rows?.length === 0 && (
                    <div className="text-2xl w-full h-full flex-center py-8">
                        필터 결과가 없습니다.
                    </div>
                )}
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}

export default ServerTable
