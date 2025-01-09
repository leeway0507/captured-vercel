import NextAuth, { DefaultSession, CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'

export interface CustomUser {
    userId: string
    email: string
    name: string
    signUpType: string
    accessToken: string
}

// user Session Schema 재정의
declare module 'next-auth' {
    interface Session {
        user: CustomUser & DefaultSession['user']
    }
}

const transformStyle = (res: {
    user_id: string
    email: string
    kr_name: string
    sign_up_type: string
    access_token: string
}): CustomUser => ({
    userId: res.user_id,
    email: res.email,
    name: res.kr_name,
    signUpType: res.sign_up_type,
    accessToken: res.access_token,
})

export const signInByEmail = async (email: string, password: string) => {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)
    const res = await fetch(`${process.env.AUTH_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
        cache: 'no-store',
    })

    return { status: res.status, data: await res.json() }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            authorize: async (credentials) => {
                const { status, data } = await signInByEmail(
                    credentials.email as string,
                    credentials.password as string,
                )

                if (status === 200) return transformStyle(data)

                throw new CredentialsSignin(data.detail)
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user }
        },
        async session({ session, token }) {
            // eslint-disable-next-line no-param-reassign
            session.user.name = token.name as string

            // eslint-disable-next-line no-param-reassign
            session.user.email = token.email as string

            // eslint-disable-next-line no-param-reassign
            session.user.signUpType = token.signUpType as string

            // eslint-disable-next-line no-param-reassign
            session.user.accessToken = token.accessToken as string

            // eslint-disable-next-line no-param-reassign
            session.user.userId = token.userId as string
            return session
        },
    },
    pages: {
        signIn: 'auth/signin',
    },
})
