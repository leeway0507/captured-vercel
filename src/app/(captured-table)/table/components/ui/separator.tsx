/* eslint-disable react/prop-types */

'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import cn from '@/utils/cn'

const Separator = React.forwardRef<
    React.ElementRef<typeof SeparatorPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...p }, ref) => (
    <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
            'shrink-0 bg-border',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            className,
        )}
        {...p}
    />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export default Separator
