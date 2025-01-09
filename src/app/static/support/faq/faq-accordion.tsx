import { AccordionWrapper, AccordionComponent } from '@/components/accordion'
import * as faq from './contents'

export function GeneralAccordion() {
    return (
        <>
            <h1 className="text-xl font-medium pt-4 pb-2">일반</h1>
            <AccordionWrapper>
                <AccordionComponent
                    title="상세 사이즈 문의가 가능한가요?"
                    content={faq.SizeInfo}
                    value="sizeInfo"
                />
                <AccordionComponent
                    title="예상 환불 기간이 궁금해요."
                    content={faq.RefundProcess}
                    value="refundProcess"
                />
                <AccordionComponent
                    title="직접 문의하고 싶어요."
                    content={faq.QuestionInfo}
                    value="questionInfo"
                />
            </AccordionWrapper>
        </>
    )
}

export function ShipmentAccordion() {
    return (
        <>
            <div className="text-xl font-medium pt-4 pb-2">배송 문의</div>
            <AccordionWrapper>
                <AccordionComponent
                    title="해외 배송과 국내 배송 차이가 궁금해요."
                    content={faq.Process}
                    value="process"
                />
                <AccordionComponent
                    title="배송비를 알고싶어요."
                    content={faq.ShippingFee}
                    value="shippingFee"
                />
                <AccordionComponent
                    title="관부가세 대납 여부를 알고싶어요."
                    content={faq.CustomFee}
                    value="customFee"
                />
                <AccordionComponent
                    title="배송 상태를 알고 싶어요."
                    content={faq.NotYetShipped}
                    value="notYetShipped"
                />
                <AccordionComponent
                    title="해외 배송 시 묶음 배송이 가능한가요?"
                    content={faq.Package}
                    value="package"
                />
                <AccordionComponent
                    title="반품 및 취소 방법을 알고싶어요."
                    content={faq.RefundAndExchange}
                    value="refundAndExchange"
                />
            </AccordionWrapper>
        </>
    )
}
