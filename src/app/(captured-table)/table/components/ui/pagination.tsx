/* eslint-disable react/prop-types */

import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'

import cn from '@/utils/cn'
import Link from 'next/link'
import { ButtonProps, buttonVariants } from '@/app/(captured-table)/table/components/ui/button'

function Pagination({ className, ...p }: React.ComponentProps<'nav'>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...p}
        />
    )
}
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
    ({ className, ...p }, ref) => (
        <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...p} />
    ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
    ({ className, ...p }, ref) => <li ref={ref} className={cn('', className)} {...p} />,
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
    // eslint-disable-next-line react/require-default-props
    isActive?: boolean
} & Pick<ButtonProps, 'size'> &
    React.ComponentProps<typeof Link>

function PaginationLink({ className, isActive, size = 'icon', ...p }: PaginationLinkProps) {
    return (
        <Link
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                buttonVariants({
                    variant: isActive ? 'outline' : 'ghost',
                    size,
                }),
                className,
            )}
            {...p}
        />
    )
}
PaginationLink.displayName = 'PaginationLink'

function PaginationPrevious({ className, ...p }: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn('gap-1 pl-2.5', className)}
            {...p}
        >
            <ChevronLeftIcon className="h-4 w-4" />
            <span>Previous</span>
        </PaginationLink>
    )
}
PaginationPrevious.displayName = 'PaginationPrevious'

function PaginationNext({ className, ...p }: React.ComponentProps<typeof PaginationLink>) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn('gap-1 pr-2.5', className)}
            {...p}
        >
            <span>Next</span>
            <ChevronRightIcon className="h-4 w-4" />
        </PaginationLink>
    )
}
PaginationNext.displayName = 'PaginationNext'

function PaginationEllipsis({ className, ...p }: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            className={cn('flex h-9 w-9 items-center justify-center', className)}
            {...p}
        >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">More pages</span>
        </span>
    )
}
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
}
