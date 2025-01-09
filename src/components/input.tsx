import { Input } from './shadcn-ui/input'

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelName: string
}

export function InputWithLabel({ labelName, ...p }: InputWithLabelProps) {
    return (
        <div>
            <label htmlFor={labelName}>
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="pb-2">{labelName}</div>
                </div>
                <Input name={labelName} {...p} />
            </label>
        </div>
    )
}
