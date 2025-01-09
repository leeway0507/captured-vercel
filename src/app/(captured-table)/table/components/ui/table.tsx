/* eslint-disable react/prop-types */
import * as React from 'react'

import cn from '@/utils/cn'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
    ({ className, ...p }, ref) => (
        <table ref={ref} className={cn('w-full caption-bottom', className)} {...p} />
    ),
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...p }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...p} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...p }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...p} />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...p }, ref) => (
    <tfoot
        ref={ref}
        className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
        {...p}
    />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...p }, ref) => (
        <tr
            ref={ref}
            className={cn(
                'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
                className,
            )}
            {...p}
        />
    ),
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...p }, ref) => (
    <th
        ref={ref}
        className={cn(
            'h-10 px-2 text-left align-middle font-medium text-black/80 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            className,
        )}
        {...p}
    />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...p }, ref) => (
    <td
        ref={ref}
        className={cn(
            'px-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
            className,
        )}
        {...p}
    />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...p }, ref) => (
    <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...p} />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
