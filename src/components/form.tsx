import { UseFormReturn } from 'react-hook-form'
import { Input } from './shadcn-ui/input'

interface CustomFormFieldProps<T extends UseFormReturn<any>>
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'> {
    formName: string
    type: string
    label: string
    form: T
    disabled?: boolean
}

export function FormField<T extends UseFormReturn<any>>({
    formName,
    label,
    form,
    ...inputProps
}: CustomFormFieldProps<T>) {
    const error = form.formState.errors[formName]
    return (
        <div className="w-full">
            <label htmlFor={formName}>
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="pb-2">{label}</div>
                    <div className="text-red-500">{error && error?.message?.toString()}</div>
                </div>
                <Input
                    {...form.register(formName)}
                    {...inputProps} // Spread the remaining p here
                />
            </label>
        </div>
    )
}

export function EmailField<T extends UseFormReturn<any>>({ form }: { form: T }) {
    return (
        <FormField
            form={form}
            formName="email"
            label="이메일 주소"
            type="text"
            autoComplete="username"
        />
    )
}

export function PasswordField<T extends UseFormReturn<any>>({ form }: { form: T }) {
    return (
        <FormField
            form={form}
            formName="password"
            label="비밀번호"
            type="password"
            autoComplete="current-password"
        />
    )
}

export function PasswordConfirmField<T extends UseFormReturn<any>>({ form }: { form: T }) {
    return (
        <FormField form={form} formName="passwordConfirm" label="비밀번호 확인" type="password" />
    )
}

export function UserNameField<T extends UseFormReturn<any>>({ form }: { form: T }) {
    return <FormField form={form} formName="username" label="성 명" type="text" />
}
