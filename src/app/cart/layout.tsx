import Nav from '@/components/common/nav'
import Footer from '@/components/common/footer'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Nav />
            <main className="page-container">{children}</main>
            <Footer />
        </>
    )
}
