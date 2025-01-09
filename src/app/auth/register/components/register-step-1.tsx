'use client'

import { UserNameField, FormField, PasswordConfirmField, PasswordField } from '@/components/form'
import { ConfirmButton } from '@/components/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { Step1State } from '@/types'
import EmailVerificationButton from './email-verification'
import PolicyCheckbox from './policy-checkbox'

export default function Step1({ setStep1Data }: { setStep1Data: (b: Step1State) => void }) {
    const [isVerfied, setIsverfied] = useState(false)
    const [termCheck, setTermCheck] = useState(false)

    const formSchema = z
        .object({
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
        .superRefine((data, ctx) => {
            if (data.password !== data.passwordConfirm) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: '비밀번호가 일치하지 않습니다.',
                    path: ['passwordConfirm'],
                })
            }
        })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'all',
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        const { passwordConfirm, ...rest } = data
        setStep1Data(rest)
    }

    const nextStepCondition = form.formState.isValid && termCheck && isVerfied

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                <div className="flex items-end w-full gap-3">
                    <div className="flex-auto">
                        <FormField
                            form={form}
                            formName="email"
                            label="이메일 주소"
                            type="text"
                            disabled={isVerfied}
                        />
                    </div>
                    <EmailVerificationButton isVerfied={isVerfied} setIsverfied={setIsverfied} />
                </div>
                <UserNameField form={form} />
                <PasswordField form={form} />
                <PasswordConfirmField form={form} />
                <PolicyCheckbox setTermCheck={setTermCheck} />
                <ConfirmButton type="submit" className="w-full " disabled={!nextStepCondition}>
                    배송지 입력하기
                </ConfirmButton>
            </form>
        </FormProvider>
    )
}
