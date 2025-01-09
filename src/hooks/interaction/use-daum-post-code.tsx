import { useDaumPostcodePopup } from 'react-daum-postcode'
import { useState } from 'react'

export function usePostcode() {
    const [krAddress, setKrAddress] = useState<string>()
    const [enAddress, setEnAddress] = useState<string>()

    const open = useDaumPostcodePopup()

    const handleComplete = (data: any) => {
        let kor = data.roadAddress
        const building = data.buildingName
        const eng = data.roadAddressEnglish

        if (building !== '') {
            kor += `(${building})`
        }

        setKrAddress(kor)
        setEnAddress(eng)
    }

    const openAddressDialog = () => {
        open({ onComplete: handleComplete })
    }

    return { openAddressDialog, krAddress, enAddress }
}
