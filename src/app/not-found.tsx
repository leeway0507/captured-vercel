import Link from 'next/link'

async function Page() {
    return (
        <main className="page-container page-max-frame flex items-center flex-col px-2 md:px-0 justify-center space-y-4">
            <h1 className="text-3xl">페이지를 찾을 수 없습니다.</h1>
            <Link href="/" className="font-medium underline text-lg">
                {' '}
                홈으로 돌아가기
            </Link>
        </main>
    )
}

export default Page
