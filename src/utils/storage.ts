export const loadFromLocal = <T>(name: string): T | undefined => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(name)
        return data ? JSON.parse(data) : undefined
    }
    return undefined
}

export const saveToLocal = <T>(name: string, data: T): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(name, JSON.stringify(data))
    }
}
