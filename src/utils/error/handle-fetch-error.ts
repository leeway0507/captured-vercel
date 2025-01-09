import { toast } from 'react-toastify'
import { logError } from './log-error'
import { CustomError } from './custom-error'

interface CustomSuccessResponse<T> {
    result: 'success'
    resp: T
}
interface CustomErrorResponse {
    result: 'error'
    resp: any
}

export type HandleFetchErrorResp<T> = CustomErrorResponse | CustomSuccessResponse<T>

export default function CatchError<T>(
    resp: HandleFetchErrorResp<T>,
    errorPopUp?: 'clientSideErrorPopUp',
) {
    if (resp.result === 'error') {
        if (errorPopUp === 'clientSideErrorPopUp') toast.error(resp.resp)
        throw new Error(resp.resp)
    }

    if (resp.result === 'success') {
        return resp.resp
    }

    throw new Error('input is not CustomErrorResponse | CustomSuccessResponse type')
}

interface ErrorCaseProps {
    [key: number]: string
}

const ERROR_CASE = {
    401: '권한이 없습니다.',
    404: '일치하는 정보가 없습니다.',
    500: '요청에 실패했습니다.',
}

const ACCEPT_CODE = [200, 201, 202, 303, 307]

export const handleFetchError = async <T>(
    fetchFn: () => Promise<{ status: number; data: T }>,
    errorCase?: ErrorCaseProps, // Assuming you want to pass status and data to errorCase
    customAcceptCode?: Array<number>,
): Promise<HandleFetchErrorResp<T>> => {
    try {
        const resp = await fetchFn()
        const acceptCode = new Set([...ACCEPT_CODE, ...(customAcceptCode || [])])
        if (acceptCode.has(resp.status)) return { result: 'success', resp: resp.data }
        throw new CustomError('', resp.status, resp.data)
    } catch (error) {
        const err = error as CustomError
        const message = { ...ERROR_CASE, ...errorCase }[err.status] || JSON.stringify(err.data)
        logError(`message : ${message} \n fetchFn : ${fetchFn.toString()} `)

        return { result: 'error', resp: message }
    }
}
