import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import useScrollDirection, { ScrollDirectionProps } from './use-scroll-direction'

export default function useIntersectionObserver(
    trigger: (
        ref: React.RefObject<HTMLDivElement>,
        appRouter: AppRouterInstance,
        scrollDirection: ScrollDirectionProps,
    ) => void,
    rootMargin?: string,
    threshold?: number,
) {
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const scrollDirection = useScrollDirection()

    useEffect(() => {
        const handleIntersect = ([entry]: IntersectionObserverEntry[]) => {
            if (entry.isIntersecting) {
                trigger(ref, router, scrollDirection)
            }
        }

        let observer: IntersectionObserver
        if (ref.current) {
            observer = new IntersectionObserver(handleIntersect, {
                rootMargin,
                threshold,
            })
            observer.observe(ref.current)
        }
        return () => observer && observer.disconnect()
    }, [ref, rootMargin, threshold, scrollDirection])

    return ref
}
