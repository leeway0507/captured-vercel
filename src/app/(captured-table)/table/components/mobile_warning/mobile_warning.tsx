'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
    DialogFooter,
} from '@/app/(captured-table)/table/components/ui/dialog'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import Image from 'next/image'
import { encodeHex } from '@/app/(captured-table)/table/utils'

const divClass = 'relative w-full aspect-square flex-center p-1 '
const ImageClass = 'object-contain '

function saveMobileWarningState() {
    const mobileWarningKey = encodeHex('mobile warning')
    const TimeOut24H = new Date()
    TimeOut24H.setHours(TimeOut24H.getHours() + 24)

    const mobileWarningValue = JSON.stringify(TimeOut24H.getTime())
    localStorage.setItem(mobileWarningKey, mobileWarningValue)
}
function loadMobileWarningState() {
    const mobileWarningKey = encodeHex('mobile warning')
    const mobileWarningState = localStorage.getItem(mobileWarningKey)
    const mobileWarningValue: number | null = mobileWarningState && JSON.parse(mobileWarningState)
    return mobileWarningValue
}

function MobileTabletImg() {
    return (
        <div className={`${divClass}`}>
            <Image
                src="/icons/mobile-warning.png"
                alt="mobile-warning"
                unoptimized
                sizes="30px"
                className={ImageClass}
                width={200}
                height={200}
            />
        </div>
    )
}

export default function MobileWarning() {
    const [open, setOpen] = useState(false)
    useEffect(() => {
        const browserWidth = window.innerWidth
        const isMobile = browserWidth <= 768
        const timer = loadMobileWarningState()
        const currTime = new Date()
        const timeOut = timer! - currTime.getTime() <= 0
        let state = false
        if (isMobile && (!timer || timeOut)) {
            state = true
        }
        setOpen(state)
    }, [])
    const closeHandler = () => {
        setOpen(false)
        saveMobileWarningState()
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild />
            <DialogContent className="w-[90vw] max-w-[400px] max-h-[500px] flex-center gap-1 rounded-lg">
                <MobileTabletImg />
                <div>원활한 제품검색을 위해</div>
                <div>
                    <span className="font-bold underline">PC/태블릿 환경</span>을 이용해주세요.
                </div>
                <DialogFooter className="sm:justify-start pt-4">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            asChild={false}
                            onClick={closeHandler}
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
