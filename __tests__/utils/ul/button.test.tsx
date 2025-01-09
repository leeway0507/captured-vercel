import { getToggleStatus } from '@/components/button'

describe('General Component Logic', () => {
    it('should return "selected" status', () => {
        const sizeList = ['230', '235', '240']
        const selected = '230'

        const sizeStatusList = getToggleStatus(sizeList, selected)

        expect(sizeStatusList.find((s) => s.item === '230')).toEqual({
            item: '230',
            status: 'selected',
        })
    })
    it('should return "init" status', () => {
        const sizeList = ['230', '235', '240']
        const selected = ''

        const sizeStatusList = getToggleStatus(sizeList, selected)

        sizeStatusList.map((o) => expect(o.status).toBe('init'))
    })
})
