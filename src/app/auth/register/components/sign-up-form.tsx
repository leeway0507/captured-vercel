import { z } from 'zod'

import { Step2State } from '@/types'
import { signUpAction } from '@/actions/auth'
import { AddressFormCasting } from '@/components/address'

const createSignUpFormSchema = () =>
    z.object({
        email: z.string(),
        krName: z.string(),
        password: z.string(),
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

export default function SignUpForm({ defaultValue }: { defaultValue: Step2State }) {
    const formSchema = createSignUpFormSchema()

    return (
        <AddressFormCasting
            defaultValue={defaultValue}
            formSchema={formSchema}
            buttonText="가입하기"
            submitFn={signUpAction}
        />
    )
}
