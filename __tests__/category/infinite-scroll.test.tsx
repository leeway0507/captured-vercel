import '@/__mocks__/intersectionObserver-mock'
import '@/__mocks__/useRouter-mock'
import { changeUrlMock } from '@/__mocks__/url-mock'
import { renderHook, render } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import useIntersectionObserver from '@/hooks/interaction/use-infinite-scroll'
import { getNextPageNum, updatePageParams } from '@/app/shop/product-list'

jest.mock('../../hooks/interaction/use-scroll-direction', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue('down'),
}))

describe('product-infinite-scroll', () => {
    const expectedResult = 'page=2'
    const initialURL = new URL(window.location.href)

    let refMock: any
    beforeEach(() => {
        changeUrlMock(initialURL)
        refMock = {
            current: {
                getAttribute: jest.fn((attributeName) => {
                    if (attributeName === 'data-page') {
                        return '1'
                    }
                    if (attributeName === 'data-last-page') {
                        return '3'
                    }
                    return undefined
                }),
            },
        }
    })

    it('should return a PageNum depending on the Scroll Direction', () => {
        const currPage = '1'
        const scrollUp = 'up'
        const scrollDown = 'down'

        const upPageNum = getNextPageNum(scrollUp, currPage)
        const downPageNum = getNextPageNum(scrollDown, currPage)

        expect(upPageNum).toBe('1')
        expect(downPageNum).toBe('2')
    })

    it('should check if URL is pushed', () => {
        const router = useRouter()
        const scrollDown = 'down'

        renderHook(() => updatePageParams(refMock, router, scrollDown))

        const updatedURLObj = new URL(window.location.href)
        expect(updatedURLObj.searchParams.toString()).toBe(expectedResult)
    })

    it('should work interSectionTrigger', () => {
        function TestIntersection() {
            const ref = useIntersectionObserver(updatePageParams)
            return <div ref={ref} data-page="1" data-last-page="3" />
        }

        render(<TestIntersection />)

        const updatedURL = new URL(window.location.href)
        expect(updatedURL.searchParams.toString()).toBe(expectedResult)
    })
})
