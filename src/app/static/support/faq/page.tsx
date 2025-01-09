import { ShipmentAccordion, GeneralAccordion } from './faq-accordion'

export default function Page() {
    return (
        <div className="mx-auto w-full max-w-xl">
            <h1 className="text-2xl mb-2 w-full flex-center">자주 묻는 질문</h1>
            <ShipmentAccordion />
            <GeneralAccordion />
        </div>
    )
}
