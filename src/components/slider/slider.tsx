'use client'

import ReactSlider from 'react-slider'
import './slider.css'
import { KRW } from '@/utils/currency'

export default function SlideComponent({
    defaultData,
    selectedData,
    setSelectedData,
}: {
    defaultData: number[]
    selectedData: number[] | string[]
    setSelectedData: (v: number[]) => void
}) {
    const SelectedDataNum = selectedData.map((d) => Number(d))

    return (
        <div className="px-3 max-w-4xl mx-auto">
            <ReactSlider
                className="horizontal-slider"
                trackClassName="track"
                thumbClassName="thumb"
                defaultValue={SelectedDataNum.length > 0 ? SelectedDataNum : defaultData}
                min={defaultData[0]}
                max={defaultData[1]}
                step={10000}
                onChange={(value) => setSelectedData(value)}
            />
            <div className="grid grid-cols-5 text-center  py-2">
                <div className="text-left col-span-2">
                    {KRW(SelectedDataNum[0] || defaultData[0])}
                </div>
                <div className="text-center" />
                <div className="text-right col-span-2">
                    {KRW(SelectedDataNum[1] || defaultData[1])}
                </div>
            </div>
        </div>
    )
}
