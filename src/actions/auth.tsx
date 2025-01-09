'use server'

import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'

import { signIn, signOut } from '../auth'
import { logError } from '../utils/error/log-error'
import { fetchWithAuth } from '../utils/custom-fetch'
import { handleFetchError } from '../utils/error/handle-fetch-error'
import { AddressFormProps, Step2State, RegisterFormProps } from '../types'

export const signInAction = async (data: {
    email: string
    password: string
    redirectTo: string
}) => {
    try {
        await signIn('credentials', { ...data, redirect: false })
    } catch (error) {
        if (error) {
            const { cause } = error as AuthError

            logError(cause)

            switch (cause?.err?.message) {
                case 'Incorrect email or password':
                    return '비밀번호가 올바르지 않습니다.'
                case 'email not found':
                    return '등록된 이메일이 아닙니다.'
                default:
                    return '로그인 중 문제가 발생했습니다. 다시 시도해주세요.'
            }
        }
        return error
    }
    return redirect(data.redirectTo)
}

export const signOutAction = async () => signOut({ redirect: true, redirectTo: '/' })

export const getTokenByEmailAndName = async (email: string, username: string) => {
    const url = `${process.env.AUTH_API_URL}/api/auth/check-email-and-name?email=${email}&name=${username}`
    const fetchFn = async () => {
        const res = await fetch(url)
        return { status: res.status, data: (await res.json()) as { token: string } }
    }

    return handleFetchError(fetchFn)
}
export const fetchResetPassword = async (accessToken: string, password: string) => {
    const url = `${process.env.AUTH_API_URL}/api/mypage/resset-password`
    const fetchFn = () => fetchWithAuth(url, 'POST', { password })
    return handleFetchError(fetchFn)
}

export const verifyEmailCode = async (email: string, code: string) => {
    const url = `${process.env.AUTH_API_URL}/api/auth/verify-code?email=${email}&code=${code}`
    const fetchFn = async () => {
        const res = await fetch(url)
        return { status: res.status, data: (await res.json()) as string }
    }
    const errorCase = { 406: '코드가 일치하지 않습니다.' }
    return handleFetchError(fetchFn, errorCase)
}

export const reSendEmailCode = async (email: string) => {
    const url = `${process.env.AUTH_API_URL}/api/auth/resend-code-to-email?email=${email}`
    const fetchFn = async () => {
        const res = await fetch(url)
        return { status: res.status, data: (await res.json()) as string }
    }

    return handleFetchError(fetchFn)
}

export const checkEmailDuplication = async (email: string) => {
    const url = `${process.env.AUTH_API_URL}/api/auth/email-check?email=${email}`
    const fetchFn = async () => {
        const res = await fetch(url)
        return { status: res.status, data: (await res.json()) as string }
    }
    const errorCase = { 409: '이미 가입 된 계정입니다.' }
    return handleFetchError(fetchFn, errorCase)
}

export const register = async (user_registration: Step2State, address: AddressFormProps) => {
    const url = `${process.env.AUTH_API_URL}/api/auth/register`
    const fetchFn = async () => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_registration, address }),
        })
        return { status: res.status, data: (await res.json()) as string }
    }

    return handleFetchError(fetchFn)
}

export const signUpAction = async (data: RegisterFormProps) => {
    const { email, password, krName, ...rest } = data
    const userData = { email: email!, password: password!, krName }
    const addressData = { krName, ...rest }
    await register(userData, addressData).then(() =>
        signInAction({ email: email!, password: password!, redirectTo: '/mypage' }),
    )
}
