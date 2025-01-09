import { changeUrlMock } from './url-mock'

jest.mock('next/navigation', () => ({
    __esModule: true,
    useRouter: () => ({
        push: jest.fn((s) => {
            const url = new URL(s, window.location.origin)
            changeUrlMock(url)
        }),
        replace: jest.fn((s) => {
            const url = new URL(s, window.location.origin)
            changeUrlMock(url)
        }),
    }),
}))
