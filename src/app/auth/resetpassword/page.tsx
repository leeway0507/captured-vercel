import { ResetPassword } from './components'

async function Page() {
    return (
        <div className="max-w-sm w-full mx-auto">
            <h1 className="text-2xl pt-8 pb-8 text-center">비밀번호 찾기</h1>
            <ResetPassword />
        </div>
    )
}

export default Page
