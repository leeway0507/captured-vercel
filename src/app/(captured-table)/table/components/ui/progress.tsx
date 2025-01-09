/* eslint-disable react/prop-types */

'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import cn from '@/utils/cn'

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...p }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn('relative h-2 w-full overflow-hidden rounded-full', className)}
        {...p}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-gray-200 transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export default Progress
