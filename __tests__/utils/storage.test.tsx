import { saveToLocal, loadFromLocal } from '@/utils/storage'

describe('Storage', () => {
    it('save data to local & load from local', () => {
        const exampleObj = { hello: 'world' }
        saveToLocal('test', exampleObj)

        const localData = loadFromLocal('test')
        expect(exampleObj).toEqual(localData)
    })
})
