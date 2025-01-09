'use client'

import Image from 'next/image'
import Link from 'next/link'
import cn from '@/utils/cn'

function MainBanner({ view, link }: { view: 'pc' | 'mobile'; link: string }) {
    const viewPort = view === 'mobile' ? 'block md:hidden' : 'hidden md:block'
    return (
        <Link href={link}>
            <div className={cn('relative w-full aspect-square md:aspect-[2.2/1] py-4', viewPort)}>
                <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/banner/${view}.webp`}
                    alt="banner"
                    fill
                    sizes="1024px"
                    className="z-10 object-cover"
                    unoptimized
                    priority
                />
            </div>
        </Link>
    )
}

export default function MainLayout() {
    const link = '/shop?brand=adidas originals'
    return (
        <div className="scroll-bar-hidden w-full aspect-square md:aspect-[2.2/1]">
            <MainBanner view="mobile" link={link} />
            <MainBanner view="pc" link={link} />
        </div>
    )
}
