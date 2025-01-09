import MobileWarning from './table/components/mobile_warning/mobile_warning'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-[98vw] flex flex-col">
            <MobileWarning />
            {children}
        </div>
    )
}
