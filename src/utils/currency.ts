export function KRW(price: number) {
    const dropTenth = Math.round(price / 100) * 100
    return new Intl.NumberFormat('kr-KR', {
        style: 'currency',
        currency: 'KRW',
    }).format(dropTenth)
}
