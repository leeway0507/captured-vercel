import { auth } from '../auth'

export const fetchWithAuth = async <T>(
    url: string,
    method: string,
    body?: any,
): Promise<{ status: number; data: T }> => {
    const session = await auth()
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.accessToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    }

    const response = await fetch(url, options)
    const data = await response.json()
    return data.status ? data : { status: response.status, data }
}
