'use client'

import { AddressProps, ProductCartProps } from '@/types'
import { Button } from '@/components/shadcn-ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CustomUser } from '@/auth'
import { ConfirmButton } from '@/components/button'
import { DialogWrapper, AlertDialog } from '@/components/dialog'
import cn from '@/utils/cn'
import { usePaymentContext } from '@/components/context/payment-provider'
import { loadFromLocal, saveToLocal } from '@/utils/storage'
import { AddressForm, AddressCard, UpdateAddressButton } from '@/components/address'
import TossPaymentsWidget from './toss-payment-widget'

export function PaymentBox({
    session,
    orderItems,
}: {
    session: CustomUser
    orderItems: ProductCartProps[]
}) {
    const [mobileOpenPaymentNext, setMobileOpenPaymentNext] = useState(false)
    const openPaymentMobile = () => setMobileOpenPaymentNext(true)
    const closePaymentMobile = () => setMobileOpenPaymentNext(false)
    return (
        <>
            <ConfirmButton className="lg:hidden w-full my-4" onClick={openPaymentMobile}>
                결제방식 선택
            </ConfirmButton>
            <div
                className={cn(
                    'hidden lg:block w-full h-full space-y-4 py-4 px-2',
                    `${mobileOpenPaymentNext && 'absolute inset-0 bg-white block'}`,
                )}
            >
                <button
                    type="button"
                    onClick={closePaymentMobile}
                    className="lg:hidden flex items-center "
                >
                    <ChevronLeft size="22px" />
                    뒤로가기
                </button>
                <TossPaymentsWidget session={session} orderItems={orderItems} />
            </div>
        </>
    )
}

function AddressItem({
    address,
    setAddress,
}: {
    address: AddressProps
    setAddress: (a: AddressProps) => void
}) {
    return (
        <div className="relative">
            <Button
                size="sm"
                onClick={() => setAddress(address)}
                className="absolute  top-4 right-4"
            >
                선택
            </Button>
            <AddressCard address={address} />
        </div>
    )
}

function AddressFormModal({ address }: { address: AddressProps }) {
    const redirectTo = new URL(window.location.href)
    redirectTo.searchParams.set('selectAddressId', address.addressId!)
    return (
        <>
            <Link href="/order">
                <ChevronLeft />
            </Link>
            <AddressForm formType="update" defaultValue={address} redirectTo={redirectTo.href} />
        </>
    )
}

function Address({ address }: { address: AddressProps }) {
    const params = useSearchParams()
    const updateAddress = params.get('updateAddress')

    return (
        <>
            <div className="relative">
                <div className="absolute top-4 right-8 underline ">
                    <UpdateAddressButton addressId={address.addressId!} />
                </div>
                <AddressCard address={address} />
            </div>

            <DialogWrapper isOpen={!!updateAddress}>
                <AddressFormModal address={address} />
            </DialogWrapper>
        </>
    )
}

export function AddressList({
    data,
    setAddress,
}: {
    data: AddressProps[]
    setAddress: (a: AddressProps) => void
}) {
    return (
        <div className="max-w-lg space-y-4">
            {data.map((address) => (
                <AddressItem key={address.addressId} address={address} setAddress={setAddress} />
            ))}
        </div>
    )
}

function SelectAddress({
    data,
    onSelect,
}: {
    data: AddressProps[]
    onSelect: (a: AddressProps) => void
}) {
    const [openDialog, setOpenDialog] = useState(false)
    const handleSelectAddress = (a: AddressProps) => {
        onSelect(a)
        setOpenDialog(false)
    }
    return (
        <>
            <button
                className="flex items-center justify-end pb-2  w-full"
                type="button"
                onClick={() => setOpenDialog(true)}
            >
                다른 배송지 선택하기 <ChevronRight size="20px" />
            </button>

            <DialogWrapper isOpen={openDialog}>
                <>
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setOpenDialog(false)}
                            aria-label="뒤로가기"
                        >
                            <ChevronLeft />
                        </button>
                        <h1 className="text-lg grow text-center">배송지를 선택하세요</h1>
                    </div>
                    <AddressList data={data} setAddress={handleSelectAddress} />
                </>
            </DialogWrapper>
        </>
    )
}

const resetUrl = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete('selectAddressId')
    window.history.replaceState(null, '', url.href)
}

export function AddressBox({ data }: { data: AddressProps[] }) {
    const params = useSearchParams()
    const [address, setAddress] = useState(data[0])

    const { setAddressId } = usePaymentContext()

    const selectAddress = (a: AddressProps) => {
        setAddress(a)
        setAddressId(a.addressId)
    }

    useEffect(() => {
        setAddressId(data[0].addressId) // for tossPayments
    }, [])

    useEffect(() => {
        const addressId = params.get('selectAddressId')
        if (addressId) {
            resetUrl()
            const initAddresss = data.find((a) => a.addressId === addressId)
            setAddress(initAddresss || data[0])
            setAddressId(initAddresss?.addressId || data[0].addressId) // for tossPayments
        }
    }, [params])

    return (
        <>
            <SelectAddress data={data} onSelect={selectAddress} />
            <Address address={address || data[0]} />
        </>
    )
}

const syncCart = (availableItems: [string, boolean][]) => {
    const cartLocalKey = process.env.NEXT_PUBLIC_CART_LOCAL_STORAGE_KEY!
    const availableCartData: ProductCartProps[] | undefined = loadFromLocal(cartLocalKey)
    const data = availableCartData!.filter(({ size, product: { sku } }) =>
        availableItems.find(([form]) => form === `${sku}-${size}`),
    )
    saveToLocal(cartLocalKey, data)
}

export function ClientRendering({
    hasSoldOut,
    availableItems,
}: {
    hasSoldOut: boolean
    availableItems: [string, boolean][]
}) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [initRender, setInitRender] = useState(true)
    if (hasSoldOut && typeof window !== 'undefined' && initRender) {
        syncCart(availableItems)
        setInitRender(false)
        setDialogOpen(true)
    }
    return (
        <AlertDialog
            dialogMessage="품절된 상품이 존재합니다.  구매 가능한 상품만 주문내역에 포함됩니다."
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
        />
    )
}
