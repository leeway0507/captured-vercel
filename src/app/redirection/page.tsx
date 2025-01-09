import PageRedirection, { RedirectionProps } from './client'

export default async function Page({ searchParams }: { searchParams: RedirectionProps }) {
    return <PageRedirection redirection={searchParams} />
}
