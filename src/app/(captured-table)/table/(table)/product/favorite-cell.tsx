'use client'

import { useState } from 'react'
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import { encodeHex, decodeHex } from '@/app/(captured-table)/table/utils'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import Label from '@/app/(captured-table)/table/components/ui/label'
import { CellContext } from '@tanstack/react-table'
import { toast } from 'sonner'
import { ProductTableProps } from './price-calculator'

function getFavoriteIdList(): Array<number> {
    const s = localStorage.getItem('av_i') // favoriteId
    return s ? JSON.parse(decodeHex(s)) : new Array<number>()
}

function removeFavoriteIdList(rowId: number) {
    const d = getFavoriteIdList()
    const removedList = d.filter((i) => i !== rowId)
    const encodedString = encodeHex(JSON.stringify(removedList))
    localStorage.setItem('av_i', encodedString)
}
function addFavoriteIdList(rowId: number) {
    const d = getFavoriteIdList()
    const isExisted = d.find((i) => i === rowId)
    if (!isExisted) {
        const encodedString = encodeHex(JSON.stringify([...d, rowId]))
        localStorage.setItem('av_i', encodedString)
    }
}

function getFavoriteList(): Array<ProductTableProps> | null {
    const s = localStorage.getItem('f_rd')
    return s && JSON.parse(decodeHex(s))
}

function addFavorite<H extends ProductTableProps>(p: CellContext<H, any>) {
    const data = p.row.original
    const rowId = p.row.original.productInfo.id

    const favoriteList = getFavoriteList()
    if (favoriteList) {
        const isExisted = favoriteList.find((r) => r.productInfo.id === rowId)
        if (!isExisted) {
            const saveFile = JSON.stringify([data, ...favoriteList])
            const encodedString = encodeHex(saveFile)
            // f_rd = favorite
            localStorage.setItem('f_rd', encodedString)
            addFavoriteIdList(rowId)
        }
    } else {
        const saveFile = JSON.stringify([data])
        const encodedString = encodeHex(saveFile)
        localStorage.setItem('f_rd', encodedString)
        addFavoriteIdList(rowId)
    }
}
function removeFavorite<H extends ProductTableProps>(p: CellContext<H, any>) {
    const favoriteList = getFavoriteList()
    if (favoriteList) {
        const rowId = p.row.original.productInfo.id
        const removedFavoriteList = favoriteList.filter((r) => r.productInfo.id !== rowId)
        const saveFile = JSON.stringify(removedFavoriteList)
        const encodedString = encodeHex(saveFile)
        localStorage.setItem('f_rd', encodedString)
        removeFavoriteIdList(rowId)
    }
}

export default function Favorite<H extends ProductTableProps>({ p }: { p: CellContext<H, any> }) {
    const [favoriteId, setFavoriteIdList] = useState(() => getFavoriteIdList())
    const rowId = p.row.original.productInfo.id!

    const addFavoriteId = () => {
        if (!favoriteId.includes(rowId)) {
            setFavoriteIdList((l) => [...l, rowId])
        }
    }
    const removeFavoriteId = () => {
        setFavoriteIdList(favoriteId.filter((l) => l !== rowId))
    }

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target
        const productId = p.row.original.productInfo.product_id!
        if (checked) {
            addFavorite(p)
            addFavoriteId()
            toast.success(`즐겨찾기에 추가했습니다. : ${productId}`)
        } else {
            removeFavorite(p)
            removeFavoriteId()
            toast.success(`즐겨찾기에서 제거했습니다. : ${productId}`)
        }
    }

    const ischecked = favoriteId.includes(rowId)
    return (
        <div className="flex">
            <input
                type="checkbox"
                id={`${rowId}`}
                className="hidden"
                onChange={onChangeHandler}
                checked={ischecked}
            />
            {ischecked ? (
                <Button variant="outline" asChild={false} className="p-0">
                    <Label
                        htmlFor={`${rowId}`}
                        className="flex-center gap-1 w-full cursor-pointer px-4 py-2"
                    >
                        보관
                        <StarFilledIcon className="text-rose-600 h-4 w-4" />
                    </Label>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    asChild={false}
                    className=" bg-rose-600 text-white border-rose-600/50 p-0"
                >
                    <Label
                        htmlFor={`${rowId}`}
                        className="flex-center gap-1 w-full cursor-pointer h-full px-4 py-2"
                    >
                        보관
                        <StarIcon className="h-4 w-4 " />
                    </Label>
                </Button>
            )}
        </div>
    )
}
