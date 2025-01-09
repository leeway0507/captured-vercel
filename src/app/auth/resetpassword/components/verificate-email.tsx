'use client'

import { z } from 'zod'

import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { UserNameField, EmailField } from '@/components/form'
import { ConfirmButton } from '@/components/button'
import { getTokenByEmailAndName } from '@/actions/auth'
import { ResetDataProps } from '@/types'
import CatchError from '@/utils/error/handle-fetch-error'

export default function VerificateEmail({
    setResetData,
}: {
    setResetData: (d: ResetDataProps) => void
}) {
    const FormSchema = z.object({
        email: z.string().email({
            message: '이메일 주소가 올바르지 않습니다.',
        }),
        username: z
            .string()
            .min(2, {
                message: '2글자 이상의 한글이어야 합니다.',
            })
            .regex(/^[가-힣]+$/, {
                message: '한글만 입력 해주세요.',
            }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: 'onChange',
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await getTokenByEmailAndName(data.email, data.username)
            .then((r) => CatchError(r, 'clientSideErrorPopUp'))
            .then((r) => setResetData({ accessToken: r.token, email: form.getValues().email }))
            .then(() => toast('인증에 성공했습니다.'))
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <EmailField form={form} />
            <UserNameField form={form} />
            <ConfirmButton type="submit" className="w-full">
                이메일 확인
            </ConfirmButton>
        </form>
    )
}
