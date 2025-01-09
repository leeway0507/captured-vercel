'use client'

import { z } from 'zod'

import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import { fetchResetPassword } from '@/actions/auth'
import { ResetDataProps } from '@/types'
import CatchError from '@/utils/error/handle-fetch-error'
import { ConfirmButton } from '../button'
import { PasswordConfirmField, PasswordField } from '../form'

export default function ResetPasswordForm({
    resetData,
    redirectTo,
}: {
    resetData: ResetDataProps
    redirectTo: string
}) {
    const FormSchema = z
        .object({
            email: z.string(),
            password: z
                .string()
                .min(8, {
                    message: '8글자 이상으로 입력해주세요.',
                })
                .max(15, { message: '15자 이내로 입력해주세요.' }),
            passwordConfirm: z
                .string()
                .min(8, {
                    message: '8글자 이상으로 입력해주세요.',
                })
                .max(15, { message: '15자 이내로 입력해주세요.' }),
        })
        .superRefine(({ passwordConfirm, password }, ctx) => {
            if (passwordConfirm !== password) {
                ctx.addIssue({
                    code: 'custom',
                    message: '비밀번호가 일치하지 않습니다.',
                    path: ['passwordConfirm'],
                })
            }
        })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: resetData.email,
        },
        mode: 'onChange',
    })
    const router = useRouter()
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await fetchResetPassword(resetData.accessToken, data.password)
            .then((r) => CatchError(r, 'clientSideErrorPopUp'))
            .then(() => toast('비밀번호를 변경했습니다.'))
            .then(() => router.push(redirectTo))
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <PasswordField form={form} />
            <PasswordConfirmField form={form} />
            <ConfirmButton type="submit" className="w-full">
                변경하기
            </ConfirmButton>
        </form>
    )
}
