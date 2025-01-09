import { AddressProps } from '@/types'
import { ItemGroup, ItemRow } from '../item'

function SkeletonAddressCard() {
    return <div className="h-48 bg-gray-50 w-full" />
}

export function AddressCard({ address }: { address: AddressProps | undefined }) {
    const container = 'w-full px-4 md:px-8 py-4 bg-gray-100 rounded-lg'
    const nameBasis = 'basis-1/4'
    const valueBasis = 'basis-3/4'
    if (!address) return <SkeletonAddressCard />
    return (
        <ItemGroup className={`${container}`}>
            <ItemRow
                name="성명"
                value={`${address.krName}(${address.enName})`}
                nameBasis={nameBasis}
                valueBasis={valueBasis}
            />
            <ItemRow
                name="통관번호"
                value={address.customId}
                nameBasis={nameBasis}
                valueBasis={valueBasis}
            />
            <ItemRow
                name="휴대폰번호"
                value={address.phone}
                nameBasis={nameBasis}
                valueBasis={valueBasis}
            />
            <ItemRow
                name="한글주소"
                value={`${address.krAddress}(${address.krAddressDetail})`}
                nameBasis={nameBasis}
                valueBasis={valueBasis}
            />
            <ItemRow
                name="영문주소"
                value={`${address.enAddress} (${address.enAddressDetail})`}
                nameBasis={nameBasis}
                valueBasis={valueBasis}
            />
        </ItemGroup>
    )
}
