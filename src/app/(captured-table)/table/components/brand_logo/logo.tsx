import Image from 'next/image'

const divClass = 'relative w-[40px] lg:w-[50px] aspect-square flex-center p-1 '
const ImageClass = 'object-contain '

export default function BrandLogoImage({ brandName }: { brandName: string }) {
    const brandNameBar = brandName.replaceAll(' ', '-').toLowerCase()
    return (
        <div className={`${divClass}`}>
            <Image
                src={`/brands/captured-table/${brandNameBar}-logo.png`}
                unoptimized
                alt={`${brandNameBar}-logo`}
                className={ImageClass}
                width={200}
                height={200}
            />
        </div>
    )
}
