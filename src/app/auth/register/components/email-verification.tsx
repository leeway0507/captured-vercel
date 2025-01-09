'use client'

import { X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { z } from 'zod'

import { Button } from '@/components/shadcn-ui/button'
import { FormField } from '@/components/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormContext, useForm } from 'react-hook-form'
import { DialogWrapper } from '@/components/dialog'
import useCountDown from '@/hooks/interaction/use-count-down'
import { checkEmailDuplication, verifyEmailCode, reSendEmailCode } from '@/actions/auth'
import CatchError from '@/utils/error/handle-fetch-error'

function EmailVerificationDialog({
    email,
    handleModalClose,
    setIsverfied,
}: {
    email: string
    handleModalClose: () => void
    setIsverfied: (b: boolean) => void
}) {
    const [resetCount, setResetCount] = useState(false)
    const { defaultTimeFormat, seconds } = useCountDown(resetCount)

    const resendEmail = async () => {
        await reSendEmailCode(email).then((r) => CatchError(r, 'clientSideErrorPopUp'))
        setResetCount((old) => !old)
    }

    const FormSchema = z.object({
        code: z.string().length(6, { message: '6자리 인증코드를 입력해주세요.' }),
    })

    const codeForm = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: 'onSubmit',
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        verifyEmailCode(email, data.code)
            .then((r) => CatchError(r, 'clientSideErrorPopUp'))
            .then(() => alert('인증을 완료했습니다.'))
            .then(() => {
                handleModalClose()
                setIsverfied(true)
            })
    }

    return (
        <>
            <div className="absolute top-2 right-5">
                <Button variant="ghost" size="icon" onClick={handleModalClose}>
                    <X size="20px" />
                </Button>
            </div>

            <form
                onSubmit={codeForm.handleSubmit(onSubmit)}
                className="flex w-full items-end gap-2"
            >
                <FormField
                    form={codeForm}
                    formName="code"
                    label="인증번호 입력"
                    type="string"
                    disabled={seconds === 0}
                />
                <Button variant="ghost" type="submit" disabled={seconds === 0}>
                    확인
                </Button>
            </form>

            <section className="flex justify-between  px-2">
                <div>{defaultTimeFormat(seconds)}</div>
                <button type="button" className="underline text-gray-500" onClick={resendEmail}>
                    인증코드 재발송
                </button>
            </section>
        </>
    )
}

export default function EmailVerificationButton({
    isVerfied,
    setIsverfied,
}: {
    isVerfied: boolean
    setIsverfied: (b: boolean) => void
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const form = useFormContext()
    const state = form.getFieldState('email')
    const verified = state.isDirty && !state.error
    const { email } = form.getValues()
    form.watch('email')

    const checkEmail = useCallback(async () => {
        checkEmailDuplication(email)
            .then(() => alert('서비스를 종료하여 회원가입이 불가합니다.'))
        // .then((r) => CatchError(r, 'clientSideErrorPopUp'))
        // .then(() => alert('입력하신 메일주소로 인증코드를 발급했습니다.'))
        // .then(() => setIsOpen(true))
    }, [email])
    return (
        <>
            <Button type="button" onClick={checkEmail} disabled={!verified || isVerfied}>
                {isVerfied ? '인증 확인' : '이메일 인증'}
            </Button>
            <DialogWrapper isOpen={isOpen}>
                <EmailVerificationDialog
                    email={email}
                    handleModalClose={() => setIsOpen(false)}
                    setIsverfied={setIsverfied}
                />
            </DialogWrapper>
        </>
    )
}
