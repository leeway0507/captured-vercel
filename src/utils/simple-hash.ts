export const simpleHash = (s: string) => {
    const hash = s.split('').reduce((h: number, char: string) => {
        const charCode = char.charCodeAt(0)

        // eslint-disable-next-line no-bitwise
        return (h << 5) - h + charCode
    }, 0)

    // eslint-disable-next-line no-bitwise
    return (hash >>> 0).toString(36).padStart(7, '0')
}
