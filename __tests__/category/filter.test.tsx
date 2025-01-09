import '@/__mocks__/useRouter-mock'
import { changeUrlMock } from '@/__mocks__/url-mock'
import { useRouter } from 'next/navigation'
import { renderHook, act } from '@testing-library/react'
import { getFilterParams, useFilterParams } from '@/hooks/data/use-filter'

describe('Filter Component Logic', () => {
    const filterObj = {
        brand: ['adidas', 'nike'],
        size: ['230', '235'],
    }
    const testUrl = 'http://localhost/?brand=adidas%2Cnike&size=230%2C235'

    it('should return filterObj', () => {
        const UrlObj = new URL(testUrl)
        changeUrlMock(UrlObj)

        const obj = getFilterParams()
        expect(obj).toEqual(filterObj)
    })

    it('should not return page Parms', () => {
        const URLwithPageParams = `${testUrl}&page=1`
        const UrlObj = new URL(URLwithPageParams)
        changeUrlMock(UrlObj)

        const obj = getFilterParams()
        expect(obj).toEqual(filterObj)
    })

    describe('useFilterParams', () => {
        const updatedFilterObj = {
            brand: ['adidas', 'nike', 'asics'],
            size: ['230', '235'],
        }
        const updatedTestUrl = 'http://localhost/?brand=adidas%2Cnike%2Casics&size=230%2C235'

        it('should get initial filterState', () => {
            const { result } = renderHook(() => useFilterParams())
            const { filterState } = result.current

            expect(filterState).toEqual(filterObj)
        })

        it('should update filterState when setFilterState is called', () => {
            const { result } = renderHook(() => useFilterParams())

            act(() => result.current.setFilterState(updatedFilterObj))

            expect(result.current.filterState).toEqual(updatedFilterObj)
        })

        it('should reset filterState when resetFilterState is called', () => {
            const { result } = renderHook(() => useFilterParams())

            act(() => result.current.setFilterState(updatedFilterObj))
            act(() => result.current.resetFilterState())

            expect(result.current.filterState).toEqual(filterObj)
        })

        it('should apply updated filter when applyFilterToURL is called', () => {
            const { result } = renderHook(() => useFilterParams())

            act(() => result.current.setFilterState(updatedFilterObj))
            act(() => result.current.applyFilterToURL())

            const updatedURLObj = new URL(window.location.href)
            expect(updatedURLObj.href).toBe(updatedTestUrl)
        })
    })
})
