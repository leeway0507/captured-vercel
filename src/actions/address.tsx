'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { fetchWithAuth } from '../utils/custom-fetch'

import { handleFetchError } from '../utils/error/handle-fetch-error'
import { AddressFormProps, AddressProps } from '../types'

export const getAddressAll = async () => {
    const url = `${process.env.AUTH_API_URL}/api/mypage/get-address`
    const fetchFn = () => fetchWithAuth<AddressProps[]>(url, 'GET')
    return handleFetchError(fetchFn)
}

export const getAddressById = async (addressId: string) => {
    const url = `${process.env.AUTH_API_URL}/api/mypage/get-address-info?address_id=${addressId}`
    const fetchFn = () => fetchWithAuth<AddressProps>(url, 'GET')
    return handleFetchError(fetchFn)
}

export const createAddress = async (data: AddressFormProps, redirectUrl: string) => {
    const url = `${process.env.AUTH_API_URL}/api/mypage/create-address`

    const fetchFn = () => fetchWithAuth(url, 'POST', data)
    return handleFetchError(fetchFn).then(() => redirect(redirectUrl))
}

export const updateAddress = async (data: AddressFormProps, redirectUrl: string) => {
    const url = `${process.env.AUTH_API_URL}/api/mypage/update-address`
    const fetchFn = () => fetchWithAuth(url, 'POST', data)
    return handleFetchError(fetchFn).then(() => redirect(redirectUrl))
}

export const deleteAddress = async (formData: FormData) => {
    const addressId = formData.get('addressId')
    if (!addressId) throw new Error('address id is null')

    const url = `${process.env.AUTH_API_URL}/api/mypage/delete-address`
    const fetchFn = () =>
        fetchWithAuth(url, 'POST', {
            address_id: addressId,
        })
    return handleFetchError(fetchFn).then(() => revalidatePath('/'))
}
