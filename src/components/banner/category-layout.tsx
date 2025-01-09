import { Container, ResponsiveCardTitle } from './_component'

export function LocalCardTitle({ name }: { name: string }) {
    return (
        <ResponsiveCardTitle
            src={`layout/${name}.webp`}
            href={`/shop?pageType=${name}`}
            name={name}
            aspect="aspect-square"
        />
    )
}

export default async function CategoryLayout() {
    const container =
        'mx-auto w-full layout-max-frame flex flex-col gap-2  md:grid md:grid-cols-3 md:px-4 px-1 '

    return (
        <Container className={`${container}`}>
            <LocalCardTitle name="clothing" />
            <LocalCardTitle name="shoes" />
            <LocalCardTitle name="accessory" />
        </Container>
    )
}
