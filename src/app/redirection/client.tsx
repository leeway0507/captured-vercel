'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'

export interface RedirectionProps {
    to: string
    message: string
    signOut?: 'true'
}

function PageRedirection({ redirection }: { redirection: RedirectionProps }) {
    useEffect(() => {
        async function signOutFn() {
            alert(redirection.message || '잘못된 접근입니다.')
            if (redirection.signOut === 'true')
                await signOut({ redirect: true, callbackUrl: redirection.to })
        }
        signOutFn()
    }, [])
    return null
}

export default PageRedirection
