'use client'

import { useState } from 'react'

import { ResetDataProps } from '@/types'
import ResetPasswordForm from '@/components/auth/reset-password-form'

import VerificateEmail from './verificate-email'

export function ResetPassword() {
    const [resetData, setResetData] = useState<ResetDataProps>()

    return !resetData ? (
        <VerificateEmail setResetData={setResetData} />
    ) : (
        <ResetPasswordForm resetData={resetData} redirectTo="/auth/signin" />
    )
}
