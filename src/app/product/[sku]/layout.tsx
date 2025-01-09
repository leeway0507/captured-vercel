import Nav from '@/components/common/nav'

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Nav hideMobileBottom />
            <main className="page-container page-max-frame">{children}</main>
        </>
    )
}
