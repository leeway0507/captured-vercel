import Link from 'next/link'
import { Session } from 'next-auth'
import { auth } from '@/auth'
import { NavBottom, NavMobileCard, NavMobileTop } from './nav-client'

function NavMobileBottom() {
    return (
        <nav className="tb:hidden fixed bottom-0 z-50 grid grid-cols-5 w-screen border bg-white py-3">
            <NavMobileCard type="home" link="/" />
            <NavMobileCard type="brand" link="/brand" />
            <NavMobileCard type="shop" link="/shop" />
            <NavMobileCard type="cart" link="/cart" />
            <NavMobileCard type="mypage" link="/mypage" />
        </nav>
    )
}

export function NavMobile({ hideMobileBottom }: { hideMobileBottom?: boolean }) {
    return (
        <div className="md:hidden block">
            <NavMobileTop hideMobileBottom={hideMobileBottom || false} />
            {!hideMobileBottom && <NavMobileBottom />}
        </div>
    )
}

function NavTop() {
    const routeStyle = 'basis-1/5 flex-center h-full'
    return (
        <nav className="flex items-center justify-around max-w-2xl mx-auto text-lg w-screen h-10">
            <Link href="/brand" className={`${routeStyle}`}>
                brand
            </Link>
            <Link href="/shop" className={`${routeStyle}`}>
                latest
            </Link>
            <Link href="/shop?category=신발" className={`${routeStyle}`}>
                shoes
            </Link>
            <Link href="/shop?category=의류" className={`${routeStyle}`}>
                clothing
            </Link>
            <Link href="/shop?category=기타" className={`${routeStyle}`}>
                accessory
            </Link>
        </nav>
    )
}

async function NavPc() {
    const session: Session | null = await auth()
    return (
        <div className="hidden md:block fixed bg-white top-0 w-screen py-2 z-50 shadow-md">
            <NavTop />
            <NavBottom session={session} />
        </div>
    )
}

function Nav({ hideMobileBottom }: { hideMobileBottom?: boolean }) {
    return (
        <>
            <NavMobile hideMobileBottom={hideMobileBottom} />
            <NavPc />
        </>
    )
}

export default Nav
