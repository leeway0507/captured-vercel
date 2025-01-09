import { renderHook, act } from '@testing-library/react'
import useScrollDirection from '@/hooks/interaction/use-scroll-direction'

describe('detect user scroll direction', () => {
    beforeEach(() => {
        // @ts-ignore
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
    })

    afterEach(() => {
        // @ts-ignore
        window.requestAnimationFrame.mockRestore()
    })

    it('should return "down" when scrolling down', () => {
        const { result } = renderHook(() => useScrollDirection())

        // scorll down
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true })

        act(() => {
            window.scrollY = 20
            window.dispatchEvent(new Event('scroll'))
        })

        expect(result.current).toBe('down')
    })

    it('should return "up" when scrolling up', () => {
        const { result } = renderHook(() => useScrollDirection())

        // scorll up
        act(() => {
            window.scrollY = 20
            window.dispatchEvent(new Event('scroll'))
        })

        act(() => {
            window.scrollY = 0
            window.dispatchEvent(new Event('scroll'))
        })

        expect(result.current).toBe('up')
    })
})
