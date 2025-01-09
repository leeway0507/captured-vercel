export const changeUrlMock = (url: URL) => {
    Object.defineProperty(window, 'location', {
        writable: true,
        value: url,
    });
}