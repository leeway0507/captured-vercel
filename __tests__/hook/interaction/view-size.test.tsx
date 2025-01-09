import { renderHook, act } from '@testing-library/react'
import useMobile from '@/hooks/interaction/user-view-size'

describe('View Interaction', () => {
    it('should return "mobile" when view smaller than 768px', () => {
        const { result } = renderHook(() => useMobile())

        // scorll down
        Object.defineProperty(window, 'innerWidth', { value: 1280, writable: true })

        act(() => {
            window.innerWidth = 570
            window.dispatchEvent(new Event('resize'))
        })

        expect(result.current).toBe('mobile')
    })

    it('should return "general" when view smaller than 768px', () => {
        const { result } = renderHook(() => useMobile())

        // scorll down
        Object.defineProperty(window, 'innerWidth', { value: 570, writable: true })

        act(() => {
            window.innerWidth = 1280
            window.dispatchEvent(new Event('resize'))
        })

        expect(result.current).toBe('general')
    })
})
