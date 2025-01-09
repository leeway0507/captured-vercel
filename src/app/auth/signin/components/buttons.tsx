import Image from 'next/image'
import { Button } from '@/components/shadcn-ui/button'
import Link from 'next/link'

function NaverLoginButton() {
    return (
        <Button className="relative w-full bg-[#03C75A] rounded-lg  hover:bg-[#03C75A] hover:opacity-85">
            <div className="absolute left-3 top-0 bottom-0 flex-center">
                <Image
                    src="/icons/naver.webp"
                    alt="naver oauth"
                    width={28}
                    height={28}
                    priority
                    unoptimized
                />
            </div>
            <span>네이버 로그인</span>
        </Button>
    )
}
function KakaoLoginButton() {
    return (
        <Button className="relative w-full bg-[#FEE500] rounded-lg hover:bg-[#FEE500] hover:opacity-85">
            <div className="absolute left-4 top-0 bottom-0 flex-center">
                <Image
                    src="/icons/kakao.webp"
                    alt="kakao oauth"
                    width={20}
                    height={20}
                    priority
                    unoptimized
                />
            </div>
            <span className="text-black/80">카카오 로그인</span>
        </Button>
    )
}

export function OauthButton() {
    return (
        <div className="w-full space-y-2">
            <NaverLoginButton />
            <KakaoLoginButton />
        </div>
    )
}

export function RegisterAndResetPassword() {
    return (
        <div className="flex justify-between w-full  px-10">
            <Link href="/auth/register">회원가입</Link>
            <Link href="/auth/resetpassword">비밀번호 찾기</Link>
        </div>
    )
}
