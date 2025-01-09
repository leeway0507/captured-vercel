import Link from 'next/link'
import { Button } from '@/app/(captured-table)/table/components/ui/button'
import { NavDefault } from './components/nav/main'

export default function NotFound() {
    return (
        <>
            <NavDefault flexableDiv />
            <div className="grow">
                <div className="flex-center flex-col gap-6 pt-[20vh]">
                    <h2 className="text-3xl">페이지를 찾을 수 없습니다.</h2>
                    <Link href="/">
                        <Button size="lg" asChild={false} className="text-lg ">
                            돌아가기
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    )
}
