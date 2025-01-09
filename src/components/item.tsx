import cn from '../utils/cn'

export function ItemGroup(p: React.HtmlHTMLAttributes<HTMLDivElement>) {
    const { children, ...rest } = p
    return <div {...rest}>{children}</div>
}

export function ItemRow({
    name,
    value,
    nameBasis,
    valueBasis,
}: {
    name: string
    value: any
    nameBasis?: string
    valueBasis?: string
}) {
    const container = ' md: flex items-center py-1'
    const defaultNameBasis = 'basis-1/4 whitespace-nowrap px-2'
    const defaultValueBasis = 'px-2 '
    return (
        <div className={`${container}`}>
            <p className={cn(defaultNameBasis, nameBasis)}>{name}</p>
            <p className={cn(defaultValueBasis, valueBasis)}>{value}</p>
        </div>
    )
}
