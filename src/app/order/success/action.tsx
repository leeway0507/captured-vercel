'use server'

import { cookies } from 'next/headers'

export const deleteOrderItemCookie = async () => {
    cookies().delete('pd_ck')
}
