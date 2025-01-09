'use client'

import { useCallback, useEffect, useState } from 'react'
import { Table, ColumnFiltersState, Column } from '@tanstack/react-table'
import { Avatar, AvatarImage } from '@/app/(captured-table)/table/components/ui/avatar'
import { components, OptionProps } from 'react-select'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
} from '@/app/(captured-table)/table/components/ui/dialog'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/app/(captured-table)/table/components/ui/accordion'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import { SelecFilterDialog, SelectFilter } from '../components/filter-component'
import { ProductTableProps } from './price-calculator'
import { CountryToISO2 } from '../../components/meta/country'
import { GetProductFilterMeta } from './hook'
import BrandLogoImage from '../../components/brand_logo/logo'
import FilterButton from '../components/button'

function BrandOptionComponent(p: OptionProps<BrandValueProps>) {
    const { data } = p
    const renderOption = useCallback(
        () => (
            <components.Option {...p} className="block">
                <div className="flex items-center gap-2 p-1 cursor-pointer">
                    <BrandLogoImage brandName={data.value} />
                    {data.label}
                </div>
            </components.Option>
        ),
        [p, data],
    )

    return renderOption()
}

export function Brand<H extends ProductTableProps>({
    column,
    columnName,
}: {
    column: Column<H, any>
    columnName: string
}) {
    const productFilter = GetProductFilterMeta()
    if (productFilter?.storeName === undefined) {
        return (
            <>
                {columnName}
                <span className="w-5 h-5" />
            </>
        )
    }

    const optionArr: BrandValueProps[] = productFilter.brand.map((brandName) => ({
        value: brandName,
        label: brandName,
    }))!
    return (
        <SelecFilterDialog
            optionArr={optionArr}
            columnName={columnName}
            column={column}
            option={BrandOptionComponent}
        />
    )
}

export type StoreValueProps = {
    value: string
    label: string
    korLabel: string
    imgUrl: string
    country: string
    flag: string
}

function StoreOptionComponent(p: OptionProps<StoreValueProps>) {
    const { data } = p

    const renderOption = useCallback(
        () => (
            <components.Option {...p} className="block">
                <div className="flex items-center justify-between gap-2 px-1 py-2 cursor-pointer">
                    <div className="flex-center gap-2">
                        <Avatar className="border border-black/40 rounded-full">
                            <AvatarImage src={data.imgUrl} />
                        </Avatar>
                        <div className="flex flex-col">
                            <div>{data.label.replaceAll('_', ' ')}</div>
                            <div className="text-gray-400 text-xs">{data.korLabel}</div>
                        </div>
                    </div>
                    <div className=" text-gray-400 text-sm">
                        {data.country}({data.flag})
                    </div>
                </div>
            </components.Option>
        ),
        [p, data],
    )

    return renderOption()
}

export function Store<H extends ProductTableProps>({
    column,
    columnName,
}: {
    column: Column<H, any>
    columnName: string
}) {
    const productFilter = GetProductFilterMeta()

    if (productFilter?.storeName === undefined) return <div>{columnName}</div>

    const optionArr: StoreValueProps[] = productFilter.storeName.map((store) => ({
        value: store.store_name,
        label: store.store_name,
        korLabel: store.kor_store_name,
        imgUrl: `/store/logo/${store.store_name}.webp`,
        country: CountryToISO2.find((c) => c.countryCode === store.country)?.countryNameKor!,
        flag: CountryToISO2.find((c) => c.countryCode === store.country)?.flag!,
    }))
    return (
        <SelecFilterDialog<StoreValueProps, H>
            optionArr={optionArr}
            columnName={columnName}
            column={column}
            option={StoreOptionComponent}
        />
    )
}

export function AccordianFilter({
    columnArr,
    columnName,
    setSelectedValue,
}: {
    columnArr: Column<ProductTableProps, any>[]
    columnName: string
    setSelectedValue: (v: ColumnFiltersState) => void
}) {
    const [selectedBrand, setSelectedBrand] = useState<string[]>([])
    const [selectedStore, setSelectedStore] = useState<string[]>([])

    useEffect(() => {
        setSelectedValue([
            {
                id: 'Brand',
                value: selectedBrand,
            },
            {
                id: 'storeInfo',
                value: selectedStore,
            },
        ])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrand, selectedStore])

    const productFilter = GetProductFilterMeta()
    if (productFilter?.storeName === undefined) return <div>{columnName}</div>

    const brandSelectValues: BrandValueProps[] = productFilter.brand.map((brandName) => ({
        value: brandName,
        label: brandName,
    }))!

    const storeSelectValues: StoreValueProps[] = productFilter.storeName.map((store) => ({
        value: store.store_name,
        label: store.store_name,
        korLabel: store.kor_store_name,
        imgUrl: `/store/logo/${store.store_name}.webp`,
        country: CountryToISO2.find((c) => c.countryCode === store.country)?.countryNameKor!,
        flag: CountryToISO2.find((c) => c.countryCode === store.country)?.flag!,
    }))

    const brandColumn = columnArr[1]
    const brandAccordianComponent = (
        <AccordionItem value="item-1">
            <AccordionTrigger>브랜드</AccordionTrigger>
            <AccordionContent>
                <SelectFilter
                    optionArr={brandSelectValues}
                    column={brandColumn}
                    option={BrandOptionComponent}
                    setSelectedOptions={setSelectedBrand}
                />
            </AccordionContent>
        </AccordionItem>
    )

    const storeColumn = columnArr[7]
    const storeAccordianComponent = (
        <AccordionItem value="item-2">
            <AccordionTrigger>편집샵</AccordionTrigger>
            <AccordionContent>
                <SelectFilter
                    optionArr={storeSelectValues}
                    column={storeColumn}
                    option={StoreOptionComponent}
                    setSelectedOptions={setSelectedStore}
                />
            </AccordionContent>
        </AccordionItem>
    )

    return (
        <Accordion type="single" collapsible className="w-full">
            {brandAccordianComponent}
            {storeAccordianComponent}
        </Accordion>
    )
}

export function DefualtHeader({ columnName }: { columnName: string }) {
    return <div className="text-center">{columnName}</div>
}

export type BrandValueProps = {
    value: string
    label: string
}

export type FavoriteOptionsProps = {
    margin: number
    commission: number
    VAT: number
}
export function Filter({
    table,
    columnName,
}: {
    table: Table<ProductTableProps>
    columnName: string
}) {
    const [selectedValue, setSelectedValue] = useState<ColumnFiltersState>([])
    const onClickHandler = () => table.setColumnFilters(selectedValue)

    const buttonComponent = (
        <div className="flex justify-end w-full gap-2 p-2">
            <DialogClose asChild>
                <Button type="button" variant="secondary" asChild={false} className="px-6">
                    취소
                </Button>
            </DialogClose>
            <DialogClose asChild>
                <Button asChild={false} className="px-6" onClick={onClickHandler}>
                    확인
                </Button>
            </DialogClose>
        </div>
    )

    const initButton = (
        <div className="flex-center gap-2">
            <DialogTrigger>
                <FilterButton />
            </DialogTrigger>
        </div>
    )

    return (
        <Dialog>
            {initButton}
            <DialogContent className="w-80 min-h-[200px] max-h-[700px] overflow-auto">
                <AccordianFilter
                    columnArr={table.getAllColumns()}
                    columnName={columnName}
                    setSelectedValue={setSelectedValue}
                />
                {buttonComponent}
            </DialogContent>
            <div />
        </Dialog>
    )
}
