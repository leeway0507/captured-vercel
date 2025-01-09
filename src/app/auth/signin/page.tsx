import SignIn from './components/signin'
import { RegisterAndResetPassword, OauthButton } from './components/buttons'

async function Page() {
    return (
        <div className="max-w-sm w-full px-4 mx-auto space-y-4">
            <SignIn />
            <RegisterAndResetPassword />
            <OauthButton />
        </div>
    )
}

export default Page
