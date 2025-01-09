'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ConfirmButton } from '@/components/button'
import { EmailField, PasswordField } from '@/components/form'
import { useSearchParams } from 'next/navigation'
import { signInAction } from '@/actions/auth'

const FormSchema = z.object({
    email: z.string().email({
        message: '이메일 주소가 올바르지 않습니다.',
    }),
    password: z.string().min(8, {
        message: '8자 이상 비밀번호를 입력해주세요.',
    }),
})

export default function SignIn() {
    const searchParams = useSearchParams()
    const redirectURL = searchParams.get('redirectTo') || '/'
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        signInAction({ ...data, redirectTo: redirectURL }).then((err) => err && alert(err))
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-8 space-y-6 w-full">
            <EmailField form={form} />
            <PasswordField form={form} />
            <ConfirmButton type="submit" className="w-full">
                로그인
            </ConfirmButton>
        </form>
    )
}
