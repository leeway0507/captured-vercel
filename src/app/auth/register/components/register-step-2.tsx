import { Step1State } from '@/types'
import SignUpForm from './sign-up-form'

const step2Adapter = (data: Step1State) => {
    const { username, ...rest } = data
    return {
        krName: username,
        ...rest,
    }
}

export default function Step2({ step1Data }: { step1Data: Step1State }) {
    return <SignUpForm defaultValue={step2Adapter(step1Data)} />
}
