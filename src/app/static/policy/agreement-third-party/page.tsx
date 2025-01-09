import ThirdPartyPolicy from '.'

export default function page() {
    return (
        <div className="w-full text-justify flex-center flex-col">
            <div className="text-2xl font-medium pb-4"> 개인정보 제3자 제공 동의</div>
            <ThirdPartyPolicy />
        </div>
    )
}
