export function encodeHex(s: string) {
    return Buffer.from(s).toString('hex')
}
export function decodeHex(encode: string) {
    return Buffer.from(encode, 'hex').toString()
}
