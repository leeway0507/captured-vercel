import Link from 'next/link'
import { Fugaz_One } from 'next/font/google'
import cn from '@/utils/cn'

const FugazeOne = Fugaz_One({ weight: ['400'], subsets: ['latin'], display: 'swap' })

function Logo() {
    return (
        <Link
            href="/"
            className={cn(
                FugazeOne.className,
                'text-2xl lg:text-3xl text-rose-600 tracking-[0.05rem]',
            )}
            scroll={false}
        >
            CAPTURED
        </Link>
    )
}
export default Logo
