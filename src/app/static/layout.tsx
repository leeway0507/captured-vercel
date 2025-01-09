import Logo from '@/components/common/logo'

export const dynamic = 'force-static'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="flex-center py-8 ">
                <Logo />
            </header>
            <main className="page-container px-4 pt-2">{children}</main>
        </>
    )
}
