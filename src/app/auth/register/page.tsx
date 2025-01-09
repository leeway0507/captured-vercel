import Register from './components'

async function Page() {
    return (
        <div className="max-w-lg w-full mx-auto">
            <h1 className="text-2xl pt-8 pb-12 text-center">회원정보 입력</h1>
            <Register />
        </div>
    )
}

export default Page
