import Link from 'next/link'

export function NoCartData() {
    return (
        <div className="grow flex-center flex-col h-[60vh] text-2xl">
            <p>장바구니가 비었습니다.</p>
            <Link className="text-gray-400 pt-5" href="/shop">
                구매하러 가기
            </Link>
        </div>
    )
}
