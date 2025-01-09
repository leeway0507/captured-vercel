import { memo } from 'react'
import { PlaneTakeoff } from 'lucide-react'

function CartShipmentInfo() {
    return (
        <div className="text-sub-black">
            <div className="flex">
                <section className="flex-center basis-1/6">
                    <PlaneTakeoff />
                </section>
                <section className="basis-5/6 flex flex-col px-2 my-3 py-2 border-s-2 border-black/80">
                    <h1 className="mx-1 text-lg my-1 font-medium">해외 구매대행 상품 안내</h1>
                    <p className="mx-1 text-justify text-gray-500">
                        구매 상품 중 해외배송 상품이 포함되어 있습니다. 상품 구입을 위해
                        개인통관부호가 필요하며 5 - 15일의 배송기간이 소요됩니다.
                    </p>
                    <div>
                        <h1 className="font-medium pt-4">해당 상품이 정품임을 보증합니다.</h1>
                        <p className=" text-gray-500 tracking-tight">
                            구매 상품이 가품일 경우, 구매가의 2배를 보상합니다.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
export default memo(CartShipmentInfo)
