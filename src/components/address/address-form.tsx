'use client'

import { z } from 'zod'
import { AddressFormProps } from '@/types'
import { updateAddress, createAddress } from '@/actions/address'
import { AddressFormCasting } from './address-form-casting'

const FORM_TYPES = {
    update: { buttonText: '변경하기', submitFn: updateAddress },
    new: { buttonText: '등록하기', submitFn: createAddress },
}

const createAddressFormSchema = () =>
    z.object({
        addressId: z.string(),
        krName: z
            .string()
            .min(2, {
                message: '2글자 이상의 한글이어야 합니다.',
            })
            .regex(/^[가-힣]+$/, {
                message: '한글만 입력 해주세요.',
            }),
        enName: z.string(),
        phone: z
            .string()
            .regex(/^\d+$/, '숫자만 입력 가능합니다.')
            .max(11, '올바른 번호를 입력해주세요.'),
        customId: z.string().length(13, '통관번호 13자리를 입력해주세요.'),
        krAddress: z.string().min(1, '주소를 입력해주세요.'),
        krAddressDetail: z.string().min(1, '상세 주소를 입력해주세요.'),
        enAddress: z.string().min(1, '주소를 입력해주세요.'),
        enAddressDetail: z.string().min(1, '상세 주소를 입력해주세요.'),
    })

export function AddressForm({
    defaultValue,
    formType,
    redirectTo,
}: {
    defaultValue: Partial<AddressFormProps> | undefined
    formType: 'update' | 'new'
    redirectTo: string
}) {
    const formSchema = createAddressFormSchema()
    const { buttonText, submitFn } = FORM_TYPES[formType]
    const submitCallback = (data: AddressFormProps) => submitFn(data, redirectTo)
    return (
        <AddressFormCasting
            defaultValue={defaultValue}
            formSchema={formSchema}
            buttonText={buttonText}
            submitFn={submitCallback}
        />
    )
}
