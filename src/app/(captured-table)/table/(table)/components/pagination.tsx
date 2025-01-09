import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/app/(captured-table)/table/components/ui/button'

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

function goToTop() {
    document.getElementsByClassName('rt-tbody')[0].scrollTo(0, 0)
}

function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    return table.getPageCount() ? (
        <div className="h-[80px] flex items-center justify-center px-8 bg-white z-40">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex-center w-[100px] text-sm font-medium whitespace-nowrap">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        asChild={false}
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => (table.setPageIndex(0), goToTop())}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        asChild={false}
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => (table.previousPage(), goToTop())}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        asChild={false}
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => (table.nextPage(), goToTop())}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        asChild={false}
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => (table.setPageIndex(table.getPageCount() - 1), goToTop())}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    ) : null
}

export default DataTablePagination
