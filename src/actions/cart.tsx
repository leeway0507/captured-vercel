'use server'

import { cookies } from 'next/headers'

export const setCartItemsToCookies = async (cartItemsString: string) => {
    cookies().set('pd_ck', cartItemsString, { maxAge: 300 })
}
