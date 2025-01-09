'use server'

import { ResponseProps } from '@/app/(captured-table)/table/type'

async function getData<T>(params: string) {
    const reqUrl = new URL(`api/${params}`, process.env.NEXT_PUBLIC_BACKEND!)
    const r = await fetch(reqUrl.href)
    const resp: ResponseProps<T> = await r.json()
    return resp.data
}

export default getData
