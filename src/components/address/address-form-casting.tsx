'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostcode } from '@/hooks/interaction/use-daum-post-code'
import { Button } from '../shadcn-ui/button'
import { ConfirmButton } from '../button'
import { FormField } from '../form'

export function AddressFormCasting<T>({
    defaultValue,
    formSchema,
    buttonText,
    submitFn,
}: {
    defaultValue: T | undefined
    formSchema: any
    buttonText: string
    submitFn: CallableFunction
}) {
    const { openAddressDialog, krAddress, enAddress } = usePostcode()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: defaultValue,
    })

    const [isPending, startTransition] = useTransition()

    const onSubmit = form.handleSubmit((data) => {
        startTransition(() => {
            submitFn(data)
        })
    })

    useEffect(() => {
        if (krAddress) form.setValue('krAddress', krAddress)
        if (enAddress) form.setValue('enAddress', enAddress)
    }, [krAddress, enAddress])

    // prettier-ignore
    return (
        <form onSubmit={onSubmit} className="space-y-6 w-full">
            <FormField form={form} label="" formName="addressId" type="hidden" />
            <div className="flex w-full gap-2">
                <FormField form={form} label="성명" formName="krName" type="text" />
                <FormField form={form} label="영문성명" formName="enName" type="text" />
            </div>
            <FormField form={form} label="휴대폰번호" formName="phone" type="text" />
            <FormField form={form} label="개인통관고유부호" formName="customId" type="text" />
            <div className=" flex-center  bg-gray-100 rounded-md border px-5 py-3 mb-2">
                개인통관고유부호 불일치는 통관지연, 오배송의 원인이 됩니다.
            </div>
            <div className="flex items-end w-full gap-3">
                <FormField
                    form={form}
                    label="한글 도로명 주소"
                    formName="krAddress"
                    type="text"
                    disabled
                />
                <Button
                    
                    variant="secondary"
                    type="button"
                    onClick={openAddressDialog}
                >
                    도로명 주소 찾기
                </Button>
            </div>
            <FormField
                form={form}
                label="상세주소(동, 호수 입력)"
                formName="krAddressDetail"
                type="text"
            />
            <div className="flex items-end w-full gap-3">
                <FormField
                    form={form}
                    label="영문 도로명 주소"
                    formName="enAddress"
                    type="text"
                    disabled
                />
                <Button
                    
                    variant="secondary"
                    type="button"
                    onClick={openAddressDialog}
                >
                    도로명 주소 찾기
                </Button>
            </div>
            <FormField
                form={form}
                label="상세주소(동,호수 입력)"
                formName="enAddressDetail"
                type="text"
            />
            <ConfirmButton
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || isPending}
            >
                {!form.formState.isValid ? '필수 항목을 입력해주세요.' : buttonText}
            </ConfirmButton>
        </form>
    )
}
