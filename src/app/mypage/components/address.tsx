import Link from 'next/link'

import { deleteAddress, getAddressAll } from '@/actions/address'
import { AddressProps } from '@/types'
import { UpdateAddressButton, AddressCard } from '@/components/address'
import CatchError from '@/utils/error/handle-fetch-error'

function DeleteAddressButton({ addressId }: { addressId: string }) {
    return (
        <form action={deleteAddress}>
            <input name="addressId" type="hidden" value={addressId} />
            <button type="submit" className="underline">
                삭제
            </button>
        </form>
    )
}

function ButtonGroup({ address }: { address: AddressProps }) {
    const isInitAddress = address.addressId?.endsWith('-0')
    return (
        <div className="underline absolute top-4 right-8  flex gap-4">
            {!isInitAddress && <DeleteAddressButton addressId={address.addressId!} />}
            <UpdateAddressButton addressId={address.addressId!} />
        </div>
    )
}

export function AddressCardWithUpdateButton({ address }: { address: AddressProps }) {
    return (
        <div className="relative">
            <ButtonGroup address={address} />
            <AddressCard address={address} />
        </div>
    )
}

function NoAddress() {
    return (
        <div className="flex-center flex-col py-8 text-xl">
            <span className="text-2xl">등록된 주소가 없습니다.</span>
            <Link href="?updateAddress=new">address</Link>
        </div>
    )
}

export async function AddressList() {
    const addresses = await getAddressAll().then(CatchError)
    if (addresses.length === 0) return <NoAddress />
    return (
        <div className="max-w-lg mx-auto">
            {addresses.length < 4 && (
                <Link href="?updateAddress=new" className="flex justify-end pe-2 pb-2">
                    + 신규주소 추가
                </Link>
            )}
            <section className="space-y-4">
                {addresses.map((a) => (
                    <AddressCardWithUpdateButton key={a.addressId} address={a} />
                ))}
            </section>
        </div>
    )
}
