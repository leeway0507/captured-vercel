'use client'

import cn from '@/utils/cn'
import { ConfirmDialog } from '@/components/dialog'
import { signOutAction } from '@/actions/auth'

export function LogoutButton() {
    const triggerClass = cn(
        'w-full flex-center whitespace-nowrap  h-7',
        'md:px-8 lg:px-12 md:h-12 md:rounded md:tracking-wider md:text-lg',
    )
    return (
        <ConfirmDialog
            buttonMessage="로그아웃"
            dialogMessage="로그아웃 하시겠습니까?"
            setIsOk={async () => signOutAction()}
            buttonClass={`${triggerClass}`}
        />
    )
}
