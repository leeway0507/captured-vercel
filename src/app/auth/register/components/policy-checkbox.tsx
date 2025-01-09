'use client'

import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DialogWrapper } from '@/components/dialog'
import ServicePolicy from '@/app/static/policy/service'
import ThirdPartyPolicy from '@/app/static/policy/agreement-third-party'
import { Button } from '@/components/shadcn-ui/button'
import PersonalPolicy from '@/app/static/policy/agreement-personal-info'

const policyComponents = {
    personal: <PersonalPolicy />,
    service: <ServicePolicy />,
    thirdParty: <ThirdPartyPolicy />,
}

function PolicyPageDialog({
    isOpen,
    handleClose,
    policyComponent,
}: {
    isOpen: boolean
    handleClose: () => void
    policyComponent: React.ReactNode
}) {
    return (
        <DialogWrapper isOpen={isOpen} handleClose={handleClose}>
            <div className="flex justify-end w-full">
                <Button variant="ghost" size="icon" onClick={handleClose}>
                    <X />
                </Button>
            </div>
            {policyComponent}
        </DialogWrapper>
    )
}

function PolicyPageDialogButton({ policy }: { policy: 'personal' | 'service' | 'thirdParty' }) {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)
    return (
        <>
            <button
                type="button"
                data-policy={policy}
                onClick={handleOpen}
                className=" text-gray-500 ps-1"
            >
                (약관보기)
            </button>
            <PolicyPageDialog
                isOpen={isOpen}
                handleClose={handleClose}
                policyComponent={policyComponents[policy]}
            />
        </>
    )
}

function PolicyDetails({
    isOpen,
    policyChecked,
    handlePolicyCheck,
}: {
    isOpen: boolean
    policyChecked: string[]
    handlePolicyCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <section className={`${isOpen ? 'block' : 'hidden'} flex flex-col  gap-1  py-1`}>
            <label htmlFor="personal">
                <input
                    type="checkbox"
                    id="personal"
                    onChange={handlePolicyCheck}
                    checked={policyChecked.includes('personal')}
                    className="me-2 accent-black "
                />
                개인정보 수집·이용 동의
                <PolicyPageDialogButton policy="personal" />
            </label>
            <label htmlFor="service">
                <input
                    type="checkbox"
                    id="service"
                    onChange={handlePolicyCheck}
                    checked={policyChecked.includes('service')}
                    className="me-2 accent-black "
                />
                서비스 이용 약관 동의
                <PolicyPageDialogButton policy="service" />
            </label>
            <label htmlFor="thirdParty">
                <input
                    type="checkbox"
                    id="thirdParty"
                    onChange={handlePolicyCheck}
                    checked={policyChecked.includes('thirdParty')}
                    className="me-2 accent-black "
                />
                개인정보 제3자 제공 동의
                <PolicyPageDialogButton policy="thirdParty" />
            </label>
        </section>
    )
}

function PolicyCheck({
    policyChecked,
    setPolicyChecked,
}: {
    policyChecked: string[]
    setPolicyChecked: React.Dispatch<React.SetStateAction<string[]>>
}) {
    const [isOpen, setIsOpen] = useState(false)

    const setUniqueChecked = (v: string) =>
        setPolicyChecked((old) => {
            if (old.includes(v)) {
                return old.filter((item) => item !== v).filter((item) => item !== 'all')
            }
            if ([...old, v].length === 3) {
                return ['all', 'personal', 'service', 'thirdParty']
            }
            return [...old, v]
        })

    const handlePolicyCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = e.target
        switch (id) {
            case 'all':
                return checked
                    ? setPolicyChecked(['all', 'personal', 'service', 'thirdParty'])
                    : setPolicyChecked([])
            case 'personal':
                return setUniqueChecked('personal')
            case 'service':
                return setUniqueChecked('service')
            case 'thirdParty':
                return setUniqueChecked('thirdParty')
            default:
                return null
        }
    }

    const chevron = isOpen ? (
        <ChevronDown size="16px" strokeWidth="3" className="inline" />
    ) : (
        <ChevronRight size="16px" strokeWidth="3" className="inline" />
    )

    const handleSectionOpen = () => setIsOpen((old) => !old)

    return (
        <>
            <label htmlFor="all">
                <input
                    type="checkbox"
                    id="all"
                    onChange={handlePolicyCheck}
                    checked={policyChecked.includes('all')}
                    className="me-2 accent-black "
                />
                <button type="button" onClick={handleSectionOpen}>
                    [필수] 서비스 이용 및 정보제공 동의 {chevron}
                </button>
            </label>
            <PolicyDetails
                isOpen={isOpen}
                policyChecked={policyChecked}
                handlePolicyCheck={handlePolicyCheck}
            />
        </>
    )
}

function AgeCheck({
    ageChecked,
    setAgeChecked,
}: {
    ageChecked: string[]
    setAgeChecked: (a: string[]) => void
}) {
    const handleAgeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target
        return checked ? setAgeChecked(['age']) : setAgeChecked([])
    }

    return (
        <label htmlFor="age" className="pt-2 ">
            <input
                type="checkbox"
                id="age"
                onChange={handleAgeCheck}
                checked={ageChecked.includes('age')}
                className="me-2 accent-black "
            />
            [필수] 만 14세 이상입니다.
        </label>
    )
}

export default function PolicyCheckbox({ setTermCheck }: { setTermCheck: (b: boolean) => void }) {
    const [ageChecked, setAgeChecked] = useState<string[]>([])
    const [policyChecked, setPolicyChecked] = useState<string[]>([])

    useEffect(() => {
        if (ageChecked.includes('age') && policyChecked.includes('all')) {
            return setTermCheck(true)
        }
        return setTermCheck(false)
    }, [ageChecked, policyChecked])

    return (
        <div className="grid">
            <PolicyCheck policyChecked={policyChecked} setPolicyChecked={setPolicyChecked} />
            <AgeCheck ageChecked={ageChecked} setAgeChecked={setAgeChecked} />
        </div>
    )
}
