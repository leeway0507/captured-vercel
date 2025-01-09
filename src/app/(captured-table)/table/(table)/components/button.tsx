import { HTMLAttributes } from 'react'
import { MixerVerticalIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import cn from '@/utils/cn'

export default function FilterButton() {
    return (
        <div className="text-white bg-black/80 py-1 px-3 rounded-sm flex-center">
            <MixerVerticalIcon className="w-3.5 h-3.5" />
            <div className="ms-1 me-1">필터</div>
        </div>
    )
}

type ButtonElement = HTMLAttributes<HTMLDivElement>

export function LeftArrowButton({ ...rest }: ButtonElement) {
    return (
        <div
            {...rest}
            className={cn(
                'rounded-full bg-rose-600 text-white flex flex-center w-7 h-7 z-[21]',
                rest.className,
            )}
            aria-label="left-arrow"
        >
            <ChevronLeftIcon className="w-5 h-5" />
        </div>
    )
}

export function RightArrowButton({ ...rest }: ButtonElement) {
    return (
        <div
            {...rest}
            className={cn(
                'rounded-full border bg-rose-600 text-white flex flex-center w-7 h-7 z-[21]',
                rest.className,
            )}
            aria-label="right-arrow"
        >
            <ChevronRightIcon className="w-5 h-5" />
        </div>
    )
}
