'use client'

import { useEffect, useState, Suspense } from 'react'
import SearchInput from '@/app/(captured-table)/table/components/nav/search-input'
import Nav from './nav'
import Logo from './logo'

export function NavMain({ checked, value }: { checked: boolean; value?: string }) {
    return (
        <div className="h-[70px] mx-auto relative px-4 py-2 flex flex-col lg:flex-row w-full items-center justify-between gap-2 z-50">
            <div className="flex basis-1/3">
                <Logo />
                <Suspense>
                    <Nav />
                </Suspense>
            </div>
            <div className={`${checked ? 'block' : 'hidden'} basis-1/3 w-full`}>
                <SearchInput value={value} />
            </div>
            <div className="basis-1/3" />
        </div>
    )
}

export function NavDefault({
    flexableDiv = false,
    value,
}: {
    flexableDiv?: boolean
    value?: string
}) {
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            if (document.getElementById('nav') == null) return null
            const scroll = window.scrollY
            if (scroll < 100) {
                return setChecked(false)
            }
            if (scroll > 150) {
                setChecked(true)
            }
            return null
        }

        // add event listener to window
        window.addEventListener('scroll', onScroll, { passive: false })

        // remove event on unmount to prevent a memory leak with the cleanup
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    let x

    if (flexableDiv && !checked) {
        x = 'hidden'
    } else {
        x = 'block'
    }
    return (
        <header className="sticky top-0 border-b w-full bg-white z-[15]">
            <input type="checkbox" id="nav" checked={checked} readOnly className="hidden" />
            <NavMain checked={flexableDiv ? checked : true} value={value} />
            <div
                className={` ${x} absolute top-[70px] w-full bg-white h-[50px] shadow-[0_2px_4px_0px_rgba(0,0,0,0.1)]`}
            />
        </header>
    )
}
