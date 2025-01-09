import * as Tabs from '@radix-ui/react-tabs'
import { Session } from 'next-auth'

import cn from '@/utils/cn'
import { auth } from '@/auth'
import { getOrderHistory } from '@/actions/order'
import { InputWithLabel } from '@/components/input'
import { UpdateAddressForm } from '@/components/address'
import ResetPasswordForm from '@/components/auth/reset-password-form'

import CatchError from '@/utils/error/handle-fetch-error'
import { redirect } from 'next/navigation'
import OrderDetail from './order-detail'
import OrderHistoryTable from './order-table'
import { AddressList } from './address'
import { LogoutButton } from './logout-button'

export async function ResetPasswordTab() {
    const {
        user: { email, signUpType, name, accessToken },
    } = (await auth()) as Session

    return (
        <div className="space-y-8 max-w-lg mx-auto">
            <div className="flex gap-2 justify-between">
                <InputWithLabel labelName="이메일" disabled value={email} />
                <InputWithLabel labelName="로그인 종류" disabled value={signUpType} />
                <InputWithLabel labelName="가입 성명" disabled value={name} />
            </div>
            <ResetPasswordForm resetData={{ accessToken, email }} redirectTo="/mypage" />
        </div>
    )
}

export function AddressTab({ addressId }: { addressId: string | undefined }) {
    return addressId ? <UpdateAddressForm addressId={addressId} /> : <AddressList />
}

export async function OrderTab({ orderId }: { orderId: string | undefined }) {
    const orderHistory = await getOrderHistory()
        .then(CatchError)
        .catch((r) => redirect(`/redirection?message=${r}&to=/&signOut=true`))

    const order = orderId && orderHistory.find((p) => p.orderId === orderId)
    return order ? <OrderDetail order={order} /> : <OrderHistoryTable orderHistory={orderHistory} />
}

function TriggerGroup() {
    const triggerGroup = cn('flex', 'md:flex-col md:text-lg')
    const triggerClass = cn(
        'w-full flex-center whitespace-nowrap  h-7',
        'md:px-8 lg:px-12 md:h-12 md:rounded md:tracking-wider md:text-lg',
        'data-[state=active]:font-medium data-[state=active]:border-b data-[state=active]:border-black/90',
        'md:data-[state=active]:font-medium md:data-[state=active]:bg-black/90 md:data-[state=active]:text-white/90',
    )

    return (
        <Tabs.List className={`${triggerGroup}`}>
            <Tabs.Trigger value="tab1" className={`${triggerClass}`}>
                주문배송
            </Tabs.Trigger>
            <Tabs.Trigger value="tab2" className={`${triggerClass}`}>
                주소관리
            </Tabs.Trigger>
            <Tabs.Trigger value="tab3" className={`${triggerClass}`}>
                비밀번호 변경
            </Tabs.Trigger>
            <LogoutButton />
        </Tabs.List>
    )
}

export default function Mypage(searchParams: { updateAddress?: string; orderId?: string }) {
    const { updateAddress, orderId } = searchParams

    const rootClass = cn('flex flex-col ', 'md:flex-row justify-center py-4 w-full gap-10')
    const contentClass = 'max-w-2xl w-full h-full py-4'

    return (
        <Tabs.Root defaultValue="tab1" orientation="vertical" className={`${rootClass}`}>
            <TriggerGroup />
            <Tabs.Content value="tab1" className={`${contentClass}`}>
                <OrderTab orderId={orderId} />
            </Tabs.Content>
            <Tabs.Content value="tab2" className={`${contentClass}`}>
                <AddressTab addressId={updateAddress} />
            </Tabs.Content>
            <Tabs.Content value="tab3" className={`${contentClass}`}>
                <ResetPasswordTab />
            </Tabs.Content>
        </Tabs.Root>
    )
}
