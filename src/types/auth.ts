import { AddressFormProps } from './address'

export interface Step1State {
    email: string
    username: string
    password: string
}

export interface Step2State {
    email: string
    krName: string
    password: string
}

export interface RegisterFormProps extends AddressFormProps {
    addressId: string
    email: string
    password: string
}

export interface ResetDataProps {
    accessToken: string
    email: string
}
