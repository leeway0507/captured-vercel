import { PlaneTakeoff, Truck } from 'lucide-react'
import {
    Process,
    ShippingFee,
    RefundAndExchange,
    CustomFee,
} from '@/app/static/support/faq/contents'

const intlContent = (
    <>
        <div className="py-2">도착 예정일 : 영업일 기준 5-15일 이내</div>
        <div>
            <h1 className="font-medium">배송비</h1>
            <ul className="pt-1 ps-1 flex flex-col gap-1">
                <li>• 가방, 악세서리, 모자 : 15,000원</li>
                <li>• 반팔, 긴팔, 셔츠, 바지, 반바지 : 15,000원</li>
                <li>• 가디건, 코트, 패딩, 후리스 : 19,000원</li>
                <li>• 신발 : 19,000원</li>
            </ul>
        </div>
    </>
)

const domeContent = (
    <>
        <div className="py-2">도착 예정일 : 영업일 기준 1-3일 이내</div>
        <div>배송비 : 3,000원</div>
    </>
)
export function ProductShipmentInfo({ type }: { type: 'intl' | 'dome' }) {
    const icon = type === 'intl' ? <PlaneTakeoff /> : <Truck />
    const title = type === 'intl' ? '해외배송 상품' : '국내배송 상품'
    const content = type === 'intl' ? intlContent : domeContent

    return (
        <div className="flex">
            <section className="flex-center basis-1/5">{icon}</section>
            <section className="basis-4/5 flex flex-col px-2 my-3 py-2 border-s-2 border-black/80">
                <div className="mx-1 text-lg my-1 font-medium">{title}</div>
                <div className="mx-1  text-justify">{content}</div>
                <div>
                    <div className="font-medium pt-4">해당 상품이 정품임을 보증합니다.</div>
                    <div>구매 상품이 가품일 경우, 구매가의 2배를 보상합니다.</div>
                </div>
            </section>
        </div>
    )
}

function SubTitle({ children }: { children: React.ReactNode }) {
    return <div className="text-xl font-medium pb-1 pt-8 ">{children}</div>
}

const boxClass = 'bg-light-gray opacity-80 rounded-md border border-gray-200 px-3 py-6'
function Contents({ children }: { children: React.ReactNode }) {
    return <div className={`${boxClass}`}>{children}</div>
}

function Title({ children, closeModal }: { children: React.ReactNode; closeModal: () => void }) {
    return (
        <div className="sticky top-0 flex justify-between items-center bg-white z-20">
            <div className="text-2xl font-medium whitespace-nowrap">{children}</div>
            <button type="button" onClick={closeModal}>
                ✕
            </button>
        </div>
    )
}

export function ProductShipmentInfoModal({ closeModal }: { closeModal: () => void }) {
    return (
        <div className="max-w-xl w-full h-full py-8 px-4 ">
            <Title closeModal={closeModal}>배송 및 반품 안내사항</Title>
            <SubTitle>배송절차</SubTitle>
            <Contents>{Process}</Contents>
            <SubTitle>배송비</SubTitle>
            <Contents>{ShippingFee}</Contents>
            <SubTitle>관부가세</SubTitle>
            <Contents>{CustomFee}</Contents>
            <SubTitle>기타</SubTitle>
            <Contents>{RefundAndExchange}</Contents>
        </div>
    )
}
