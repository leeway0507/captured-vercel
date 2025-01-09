'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogClose,
} from '@/app/(captured-table)/table/components/ui/dialog'

import Label from '@/app/(captured-table)/table/components/ui/label'
import { Input } from '@/app/(captured-table)/table/components/ui/input'
import { SaveFavoritePersonalOption } from './options'
import FilterButton from '../../components/button'
import { useFavorite } from '../context'

export type FavoriteOptionsProps = {
    margin: number
    commission: number
    VAT: number
}

export default function Filter() {
    const { getFavoriteOptions, setFavoriteOptions } = useFavorite()
    const [changedOptions, setOptions] = useState<FavoriteOptionsProps>()

    const confirmHandler = () => {
        setFavoriteOptions(changedOptions!)
        SaveFavoritePersonalOption(changedOptions!)
    }

    useEffect(() => {
        if (getFavoriteOptions) {
            setOptions(getFavoriteOptions!)
        }
    }, [getFavoriteOptions])

    if (getFavoriteOptions === undefined) return null

    const FilterTitle = (
        <div className="space-y-2">
            <DialogTitle className="font-medium leading-none">판매가 산출</DialogTitle>
            <p className="text-sm text-muted-foreground">판매가 산출을 위한 정보를 입력하세요.</p>
        </div>
    )

    const FilterContent = (
        <div className="grid gap-4">
            {FilterTitle}
            <div className="grid gap-2">
                <div className="grid grid-cols-5 items-center gap-4">
                    <Label className="col-span-3" htmlFor="width">
                        마진율(%)
                    </Label>
                    <Input
                        id="margin"
                        defaultValue={changedOptions?.margin}
                        className="col-span-2 h-8"
                        type="number"
                        min="0"
                        onChange={(e) => {
                            const newOptions: FavoriteOptionsProps = {
                                ...changedOptions!, // assuming `changedOptions` is your current state
                                margin: Number(e.target.value),
                            }
                            setOptions(newOptions)
                        }}
                    />
                </div>
                <div className="grid grid-cols-5 items-center gap-4">
                    <Label className="col-span-3" htmlFor="height">
                        수수료(%)
                    </Label>
                    <Input
                        id="commission"
                        type="number"
                        min="0"
                        defaultValue={changedOptions?.commission}
                        onChange={(e) => {
                            const newOptions: FavoriteOptionsProps = {
                                ...changedOptions!, // assuming `changedOptions` is your current state
                                commission: Number(e.target.value),
                            }
                            setOptions(newOptions)
                        }}
                        className="col-span-2 h-8"
                    />
                </div>
                <div className="grid grid-cols-5 items-center gap-4">
                    <Label className="col-span-3" htmlFor="maxHeight">
                        부가세(%)
                    </Label>
                    <Input
                        id="VAT"
                        type="number"
                        min="0"
                        defaultValue={changedOptions?.VAT}
                        onChange={(e) => {
                            const newOptions: FavoriteOptionsProps = {
                                ...changedOptions!, // assuming `changedOptions` is your current state
                                VAT: Number(e.target.value),
                            }
                            setOptions(newOptions)
                        }}
                        className="col-span-2 h-8"
                    />
                </div>
            </div>
        </div>
    )

    const FilterButtions = (
        <div className="flex justify-end w-full gap-2 p-2">
            <DialogClose asChild>
                <Button type="button" variant="secondary" asChild={false} className="px-6">
                    취소
                </Button>
            </DialogClose>
            <DialogClose asChild>
                <Button asChild={false} className="px-6" onClick={confirmHandler}>
                    확인
                </Button>
            </DialogClose>
        </div>
    )

    return (
        <Dialog>
            <DialogTrigger asChild={false}>
                <FilterButton />
            </DialogTrigger>
            <DialogContent className="w-80">
                {FilterContent}
                {FilterButtions}
            </DialogContent>
            <div />
        </Dialog>
    )
}
