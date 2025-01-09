import Fail, { PaymentFailProps } from './client'

export default async function Page({ searchParams }: { searchParams: PaymentFailProps }) {
    return <Fail paymentFail={searchParams} />
}
