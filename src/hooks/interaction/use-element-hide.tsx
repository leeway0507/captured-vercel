import { useEffect, useRef } from 'react'

const useElementHide = (minHeight: number, maxHeight: number) => {
    const ref = useRef<HTMLDivElement>(null)
    const addStyle = ['opacity-100', 'h-auto', 'translate-y-0', 'relative', 'pt-4']
    const removeStyle = ['opacity-0', 'h-0', '-translate-y-4', 'absolute', 'pt-0']

    useEffect(() => {
        const onScroll = () => {
            if (ref.current) {
                const scroll = window.scrollY
                if (scroll < minHeight) {
                    ref.current.classList.remove(...removeStyle)
                    ref.current.classList.add(...addStyle)
                }
                if (scroll > maxHeight) {
                    ref.current.classList.add(...removeStyle)
                    ref.current.classList.remove(...addStyle)
                }
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    return ref
}

export default useElementHide
