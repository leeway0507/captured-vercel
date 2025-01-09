import Logo from '@/components/common/logo'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <nav className="py-4 borer-b text-center border-b shadow w-full">
                <Logo />
            </nav>
            <main className="page-container pt-2">{children}</main>
        </>
    )
}
