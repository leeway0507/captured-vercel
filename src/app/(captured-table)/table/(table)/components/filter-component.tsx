'use client'

import React, { useEffect, useState } from 'react'
import { Column } from '@tanstack/react-table'
import { MagnifyingGlassIcon, TriangleDownIcon } from '@radix-ui/react-icons'
import Select, { components, OptionProps, DropdownIndicatorProps } from 'react-select'
import { QuestionToolTip } from '@/app/(captured-table)/table/(table)/components/utils'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/app/(captured-table)/table/components/ui/dialog'

export type DefaultSelectProps = {
    value: string
    label: string
}

export interface SelectFilterProps<V, H> {
    optionArr: V[]
    column: Column<H, any>
    option: (p: OptionProps<V>) => React.JSX.Element
    setSelectedOptions: (s: string[]) => void
}

export interface SelectFilterDialogProps<V, H> {
    optionArr: V[]
    column: Column<H, any>
    option: (p: OptionProps<V>) => React.JSX.Element
    columnName: string
}

function DropdownIndicator<T>(p: DropdownIndicatorProps<T>) {
    return (
        <components.DropdownIndicator {...p}>
            <MagnifyingGlassIcon className="h-4 w-4" />
        </components.DropdownIndicator>
    )
}

function updateFilter<T>(column: Column<T, any>, selectedValue: any | 'reset') {
    column.setFilterValue(selectedValue === 'reset' ? undefined : selectedValue)
}

export function SelectFilter<V extends DefaultSelectProps, H>({
    optionArr,
    column,
    option,
    setSelectedOptions,
}: SelectFilterProps<V, H>) {
    const [value, setValue] = useState<string[]>([])
    const currFilterValue: any = column.getFilterValue()
    const defaultValue =
        currFilterValue === undefined
            ? []
            : optionArr.filter((v) => currFilterValue.find((f: string) => f === v.value))

    useEffect(() => {
        setSelectedOptions(value)
    }, [value, setSelectedOptions])

    return (
        <div className="flex flex-col h-[350px] justify-between w-full">
            <Select
                onChange={(valArr) => setValue(valArr.map((val) => val.value))}
                options={optionArr}
                maxMenuHeight={300}
                defaultValue={defaultValue}
                menuIsOpen
                isMulti
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                components={{ Option: option, DropdownIndicator }}
                placeholder="검색하기"
                noOptionsMessage={() => '검색 결과가 없습니다.'}
                styles={{
                    control: (base) => ({
                        ...base,
                        '&:hover': { borderColor: 'gray' }, // border style on hover
                        border: '1px solid lightgray', // default border color
                        boxShadow: 'none', // no box-shadow
                        cursor: 'text',
                    }),

                    option: (base, state) => ({
                        // option에 base 지우지 말것 지우면 옵션이 안먹음
                        backgroundColor: state.isSelected ? '#e2e8f0' : 'white',
                    }),
                }}
            />
        </div>
    )
}

export function SelecFilterDialog<V extends DefaultSelectProps, H>({
    optionArr,
    columnName,
    column,
    option,
}: SelectFilterDialogProps<V, H>) {
    const filterValue = column.getFilterValue()
    const [value, setValue] = useState<string[]>([])
    return (
        <Dialog>
            <DialogTrigger
                className={`text-sm hover:bg-black/80 hover:text-white rounded-sm py-1 px-2 flex-center mx-auto ${filterValue !== undefined && 'text-white bg-black/80 '}`}
            >
                <div className="ms-1 me-1">{columnName}</div>
                <TriangleDownIcon />
            </DialogTrigger>
            <DialogContent className="w-[400px] max-h-[500px]">
                <DialogTitle>{columnName}</DialogTitle>
                <SelectFilter<V, H>
                    optionArr={optionArr}
                    column={column}
                    option={option}
                    setSelectedOptions={setValue}
                />
                <div className="flex gap-2 justify-end">
                    <DialogClose className="border-2 border-accent px-3 py-2 rounded-lg hover:bg-muted/50 text-muted-foreground bg-muted">
                        취소하기
                    </DialogClose>
                    <DialogClose
                        className="border-2 border-accent px-3 py-2 rounded-lg hover:bg-primary/90 text-primary-foreground bg-primary"
                        onClick={() => updateFilter(column, value)}
                    >
                        적용하기
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export type YesOrNoFilterProps<H> = {
    columnName: string
    column: Column<H, any>
}

function YesOrNoSelect<H>({ columnName, column }: YesOrNoFilterProps<H>) {
    const [selectedValue, setSelectedValue] = useState<{ yes: boolean; no: boolean }>({
        yes: false,
        no: false,
    })
    useEffect(() => {
        const filterValue = column.getFilterValue()
        let inputState = { yes: false, no: false }
        switch (filterValue) {
            case true:
                inputState = { yes: true, no: false }
                break

            case false:
                inputState = { yes: false, no: true }
                break

            default:
                break
        }

        setSelectedValue(inputState)
    }, [column])

    const yes = `${columnName}-yes`
    const no = `${columnName}-no`

    let confirmResult = () => {}

    if (selectedValue.yes === true && selectedValue.no === true) {
        confirmResult = () => updateFilter(column, 'reset')
    }
    if (selectedValue.yes === false && selectedValue.no === false) {
        confirmResult = () => updateFilter(column, 'reset')
    }
    if (selectedValue.yes === true && selectedValue.no === false) {
        confirmResult = () => updateFilter(column, true)
    }
    if (selectedValue.yes === false && selectedValue.no === true) {
        confirmResult = () => updateFilter(column, false)
    }

    return (
        <>
            <div className="flex justify-between items-center h-[80px] text-base px-2">
                <div>
                    <label htmlFor={yes} className="cursor-pointer">
                        <input
                            id={yes}
                            type="checkbox"
                            className="accent-black w-5"
                            onChange={() => {
                                setSelectedValue((obj) => ({ ...obj, yes: !obj.yes }))
                            }}
                            checked={selectedValue.yes}
                        />
                        <span className="ml-2">예</span>
                    </label>
                </div>
                <div>
                    <label htmlFor={no} className="cursor-pointer">
                        <input
                            id={no}
                            type="checkbox"
                            className="accent-black w-5"
                            onChange={() => {
                                setSelectedValue((obj) => ({ ...obj, no: !obj.no }))
                            }}
                            checked={selectedValue.no}
                        />
                        <span className="ml-2">아니요</span>
                    </label>
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                <DialogClose className="border-2 border-accent px-3 py-2 rounded-lg hover:bg-muted/50 text-muted-foreground bg-muted">
                    취소하기
                </DialogClose>
                <DialogClose
                    className="border-2 border-accent px-3 py-2 rounded-lg hover:bg-primary/90 text-primary-foreground bg-primary"
                    onClick={confirmResult}
                >
                    적용하기
                </DialogClose>
            </div>
        </>
    )
}

export interface YesOrNoFilterDialogProps<H> extends YesOrNoFilterProps<H> {
    infoCell: string | React.JSX.Element | null
}

export function YesOrNoFilterDialog<H>({
    columnName,
    column,
    infoCell = null,
}: YesOrNoFilterDialogProps<H>) {
    const filterValue = column.getFilterValue()
    return (
        <Dialog>
            <DialogTrigger
                className={`text-sm hover:bg-black/80 hover:text-white rounded-sm py-1 px-2 flex-center mx-auto ${filterValue !== undefined && 'text-white bg-black/80 '}`}
            >
                <div className="ms-1 me-1">{columnName}</div>
                <TriangleDownIcon />
                {infoCell ? <QuestionToolTip infoCell={infoCell} /> : null}
            </DialogTrigger>
            <DialogContent className="w-[300px] h-[200px]">
                <DialogHeader>
                    <DialogTitle>{columnName}</DialogTitle>
                    <YesOrNoSelect columnName={columnName} column={column} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
