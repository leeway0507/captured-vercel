import { useRouter } from 'next/navigation' // Correct import path for useRouter
import { useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export default function SearchInput({ value }: { value?: string }) {
    const [inputValue, setInputValue] = useState(value) // Use state to manage the input value
    const router = useRouter()

    const onKeyDownHandler = (event: { key: string }) => {
        if (event.key === 'Enter' && inputValue) {
            router.push(`/table/search?q=${inputValue}`, { scroll: false })
        }
    }
    const onClickHandler = () => {
        router.push(`/table/search?q=${inputValue}`, { scroll: false })
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value) // Update the state on input change
    }

    return (
        <div className="sticky flex flex-grow items-center min-w-[300px] max-w-[500px] h-[45px] border rounded-full shadow mx-auto z-50">
            <input
                placeholder="제품명, 제품번호를 검색하세요"
                value={inputValue} // Bind the input value to the state
                onChange={onChangeHandler}
                className="flex-grow placeholder:text-black/90 shadow-none rounded-full ps-6 pe-8 placeholder h-full text-sm placeholder:text-sm outline-rose-500"
                onKeyDown={onKeyDownHandler}
            />
            <button
                type="button"
                className="right-1 absolute flex-center rounded-full bg-rose-600 text-white h-[70%] aspect-square mx-2"
                onClick={onClickHandler}
                aria-label="Search"
            >
                <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
        </div>
    )
}
