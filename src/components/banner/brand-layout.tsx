import Link from 'next/link'
import cn from '@/utils/cn'
import { Container } from './_component'
import EmblaCarousel, { CarouselImage } from '../carousel/carousel'
import styles from '../carousel/styles.module.css'

function BrandCard({ brandName }: { brandName: string }) {
    const brandNameBar = brandName.replaceAll(' ', '-').toLowerCase()
    return (
        <Link href={`shop/?brand=${brandName}`} className={cn(styles.embla__slide, 'm-auto')}>
            <CarouselImage
                src={`/brands/black/${brandNameBar}.png`}
                alt={brandName}
                width={150}
                height={150}
                className="object-contain max-w-[80px] md:max-w-[120px] 2xl:max-w-[150px]"
            />
        </Link>
    )
}

const LOGOS = [
    'acne studios',
    "arc'teryx",
    'adidas originals',
    'our legacy',
    'patagonia',
    'stone island',
    'the north face',
]
const BrandBox = () =>
    LOGOS.map((brandName: string) => <BrandCard key={brandName} brandName={brandName} />)

export default async function BrandList() {
    return (
        <Container className="py-8 lg:px-4 bg-gray-100 w-full h-full ">
            <EmblaCarousel type="multi">
                <BrandBox />
            </EmblaCarousel>
        </Container>
    )
}
