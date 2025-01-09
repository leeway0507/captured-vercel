'use client'

import { useState } from 'react'

import { Step1State } from '@/types'
import Step1 from './register-step-1'
import Step2 from './register-step-2'

function Register() {
    const [step1Data, setStep1Data] = useState<Step1State>()

    return !step1Data ? <Step1 setStep1Data={setStep1Data} /> : <Step2 step1Data={step1Data} />
}

export default Register
