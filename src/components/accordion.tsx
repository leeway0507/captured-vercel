import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './shadcn-ui/accordion'

export function AccordionWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {children}
        </Accordion>
    )
}

export function AccordionComponent({
    title,
    content,
    value,
}: {
    title: string
    content: React.ReactNode | React.ReactNode
    value: string
}) {
    const id = `accordion-${value}`

    return (
        <AccordionItem value={id}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
    )
}
