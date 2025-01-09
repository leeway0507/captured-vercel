'use server'

import pino, { Logger } from 'pino'
import { CustomError } from './custom-error'

const streams = [
    { stream: process.stdout },
    {
        stream: pino.destination({
            dest: process.env.LOG_DIR,
            append: 'stack',
        }),
    },
]

const transport =
    process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined

const logger: Logger = pino(
    {
        timestamp: pino.stdTimeFunctions.isoTime,
        transport,
        level: process.env.PINO_LOG_LEVEL || 'info',
        redact: [],
    },
    pino.multistream(streams),
)

export const logError = async (err: unknown) => {
    if (err instanceof CustomError) return logger.error(err.data)
    return logger.error(err)
}
