'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
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
    getFilteredRowModel,
    getFacetedUniqueValues,
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
    columnPin?: { id: string; start: number; zindex: number }[]
}

type ColumnFilterProps = {
    storeInfo: string[]
    brand: string[]
}

function ServerTableFixed<TData, TValue>({
    columns,
    data,
    pageCount = 1,
    initalSorting = [],
    meta = {},
    columnPin = [],
}: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const elementRef = useRef<HTMLTableElement>(null)
    const [, setScrollEnd] = useState(0)

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
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onColumnFiltersChange: setNewColumnFilters,
        defaultColumn: {
            size: 100,
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
        setScrollEnd(elementRef!.current!.scrollWidth - 1024)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPage, newColumnFilters])

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            e.preventDefault()
            elementRef.current!.scrollBy({ top: e.deltaY, left: e.deltaX })
        }

        window.addEventListener('wheel', handleScroll, { passive: false })

        return () => {
            window.removeEventListener('wheel', handleScroll)
        }
    }, [])

    if (table.getRowModel().rows === undefined) return null

    return (
        <div className="page-max-frame mx-auto overflow-hidden lg:min-w-[1024px] ">
            <div
                className="text-sm relative h-[calc(100vh-80px)] rt-tbody  w-full overflow-auto "
                ref={elementRef}
            >
                <Table ref={elementRef}>
                    <TableHeader className="sticky top-0 w-full md:z-20 whitespace-nowrap bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const colSticky = columnPin.findIndex((o) => o.id === header.id)
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                'min-w-[10px] text-center bg-white',
                                                colSticky !== -1 && 'sticky',
                                            )}
                                            style={{
                                                left:
                                                    colSticky !== -1
                                                        ? columnPin[colSticky].start
                                                        : 0,
                                                zIndex:
                                                    colSticky !== -1
                                                        ? columnPin[colSticky].zindex + 1
                                                        : 0,
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    )
                                })}
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
                                    {row.getVisibleCells().map((cell) => {
                                        const cellSticky = columnPin.findIndex(
                                            (o) => o.id === cell.column.id,
                                        )
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    'min-w-[10px] text-center bg-white whitespace-nowrap',
                                                    cellSticky !== -1 && 'sticky',
                                                )}
                                                style={{
                                                    left:
                                                        cellSticky !== -1
                                                            ? columnPin[cellSticky].start
                                                            : 0,
                                                    zIndex:
                                                        cellSticky !== -1
                                                            ? columnPin[cellSticky].zindex
                                                            : 0,
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : null}
                </Table>
            </div>
        </div>
    )
}

export default ServerTableFixed
