'use client'

import { useEffect, useState } from 'react'

export default function useCountDown(refresh: boolean) {
    const [seconds, setSeconds] = useState(0) // 3 minutes in seconds

    useEffect(() => {
        setSeconds(180)
    }, [refresh])

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1
                }
                clearInterval(interval)
                return 0
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [seconds])

    const defaultTimeFormat = (s: number) => {
        const minutes = Math.floor(s / 60)
        const remainingSeconds = s % 60
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    }
    return { defaultTimeFormat, seconds }
}
