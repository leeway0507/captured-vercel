'use client'

import Link from 'next/link'
import {
    User,
    ShoppingCart,
    Home,
    LucideBookMarked,
    CircleUser,
    Columns3,
    Search,
    SearchIcon,
    ArrowLeft,
} from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Session } from 'next-auth'
import { useState, useRef } from 'react'
import cn from '@/utils/cn'
import useElementHide from '@/hooks/interaction/use-element-hide'
import Logo from './logo'

export function NavMobileCard({
    type,
    link,
}: {
    type: 'home' | 'cart' | 'brand' | 'shop' | 'mypage'
    link: string
}) {
    const params = usePathname()
    const icons = {
        home: <Home strokeWidth={params === link ? 2 : 1} />,
        brand: <LucideBookMarked strokeWidth={params === link ? 2 : 1} />,
        cart: <ShoppingCart strokeWidth={params === link ? 2 : 1} />,
        shop: <Columns3 strokeWidth={params === link ? 2 : 1} />,
        mypage: <CircleUser strokeWidth={params === link ? 2 : 1} />,
    }
    return (
        <Link href={link} className="flex-center flex-col">
            <div>{icons[type]}</div>
            <div className={cn('text-[11px] uppercase text-gray-500')}>{type}</div>
        </Link>
    )
}

function SearchBarOpenButton({ handleOpen }: { handleOpen: () => void }) {
    const buttonClass =
        'flex-center rounded-full bg-rose-600 text-white h-[30px] aspect-square mx-1'
    return (
        <button type="button" className={`${buttonClass}`} aria-label="Search" onClick={handleOpen}>
            <SearchIcon className="h-4 w-4" />
        </button>
    )
}

function SearchBarCloseButton({ handleClose }: { handleClose: () => void }) {
    return (
        <button type="button" onClick={handleClose} aria-label="close">
            <ArrowLeft className="h-6 w-6" />
        </button>
    )
}

export function MobileSearchInput() {
    const router = useRouter()
    const params = useSearchParams()

    const keyword = params.get('keyword') || ''
    const ref = useRef<HTMLInputElement>(null)

    const onKeyDownHandler = (event: { key: string }) => {
        const inputValue = ref.current?.value
        if (event.key === 'Enter' && inputValue !== '') {
            router.push(`/shop/search?keyword=${inputValue}`, { scroll: false })
        }
    }
    const onClickHandler = () => {
        const inputValue = ref.current?.value
        if (inputValue !== '') router.push(`/shop/search?keyword=${inputValue}`, { scroll: false })
    }

    return (
        <div className="grow relative flex items-center w-full h-[45px] border rounded-full z-50">
            <input
                placeholder="제품명, 제품번호를 검색하세요"
                className="grow placeholder:text-black/90 shadow-none rounded-full ps-6 pe-8 placeholder h-full  placeholder: outline-rose-500"
                onKeyDown={onKeyDownHandler}
                ref={ref}
                defaultValue={keyword}
            />
            <button
                type="button"
                className="right-0 absolute flex-center rounded-full bg-rose-600 text-white h-[30px] aspect-square mx-1"
                onClick={onClickHandler}
                aria-label="Search"
            >
                <SearchIcon className="h-4 w-4" />
            </button>
        </div>
    )
}

export function NavMobileTop({ hideMobileBottom }: { hideMobileBottom: boolean }) {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)
    return (
        <div className="fixed top-0 flex space-x-2 justify-between items-center w-screen p-3 z-50 border-b bg-white shadow-sm h-[55px]">
            {!isOpen ? <Logo /> : <SearchBarCloseButton handleClose={handleClose} />}
            <div className="flex justify-end items-center gap-2 pe-2 w-full">
                {!isOpen ? <SearchBarOpenButton handleOpen={handleOpen} /> : <MobileSearchInput />}
                {hideMobileBottom && (
                    <Link href="/cart">
                        <ShoppingCart strokeWidth={2} size="28px" fill="black" />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default function SearchInputMain() {
    const [inputValue, setInputValue] = useState('')
    const router = useRouter()

    const onKeyDownHandler = (event: { key: string }) => {
        if (event.key === 'Enter' && inputValue) {
            router.push(`/shop/search?keyword=${inputValue}`, { scroll: false })
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    return (
        <div className="flex gap-2 items-center h-[50px] relative border-b">
            <Search className="text-gray-500" size="18px" />
            <input
                value={inputValue}
                onChange={onChangeHandler}
                className="placeholder h-full  text-gray-500 placeholder focus:outline-none focus-visible:outline-0 "
                onKeyDown={onKeyDownHandler}
            />
        </div>
    )
}

function Icons({ userName }: { userName?: string | undefined }) {
    return (
        <div className="flex gap-4">
            <Link href="/mypage" className="flex-center gap-1 ">
                <div className=" font-medium">{userName && userName}</div>
                <User className="text-black" fill="black" size="28px" />
            </Link>
            <Link href="/cart">
                <ShoppingCart className="text-black" fill="black" size="28px" />
            </Link>
        </div>
    )
}

export function NavBottom({ session }: { session: Session | null }) {
    const elementHideRef = useElementHide(20, 40)
    const baseContainer =
        'grid grid-cols-5 text-center w-full bg-white px-16 max-w-[1280px] overflow-hidden mx-auto pt-4'
    const animation = 'duration-300 ease-in-out opacity-100 transform translate-y-0 relative'
    return (
        <div ref={elementHideRef} className={cn(baseContainer, animation)}>
            <div className="col-span-1 flex justify-start">
                <SearchInputMain />
            </div>
            <div className="col-span-3 flex-center">
                <Logo />
            </div>
            <div className="col-span-1 flex items-center justify-end">
                <Icons userName={session?.user.name} />
            </div>
        </div>
    )
}
