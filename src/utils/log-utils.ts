/* eslint-disable no-console */
import { ConsoleLogger } from '@nestjs/common'
import { LOG_LEVEL, USE_CLEAN_LOGGER } from '../config'

export class CleanLogger extends ConsoleLogger {
  private logTypeLength = 7
  log(message: string, context?: string) {
    console.log(this.formatLogMessage('log', message, context))
  }
  debug(message: string, context?: string) {
    console.debug(this.formatLogMessage('debug', message, context))
  }
  warn(message: string, context?: string) {
    console.warn(this.formatLogMessage('warn', message, context))
  }
  error(message: string, stack?: string, context?: string) {
    console.error(this.formatLogMessage('error', message, context), stack ?? '')
  }
  private formatLogMessage(type: string, message: string, context?: string) {
    const time = this.getTime()
    let logType = type.toUpperCase()

    for (let i = 0; i < this.logTypeLength - type.length; i++) {
      logType = ' ' + logType
    }
    return `${time}${logType} [${context ?? 'unknown'}] ${message}`
  }

  private getTime() {
    const date = new Date()
    return `0${date.getDate()}`.slice(-2) + '.' +
      `0${date.getMonth() + 1}`.slice(-2) + '.' +
      date.getFullYear() + ' ' +
      date.getHours() + ':' +
      `0${date.getMinutes()}`.slice(-2) + ':' +
      `0${date.getSeconds()}`.slice(-2) + '.' +
      `00${date.getMilliseconds()}`.slice(-3)
  }
}
export const loggerService = USE_CLEAN_LOGGER ? new CleanLogger() : new ConsoleLogger()


export const logError = (message: string, trace?: string, context?: string) => {
  if (!LOG_LEVEL.has('error')) { return }
  loggerService.error(message, trace, context)
}

export const logWarn = (message: string, context?: string) => {
  if (!LOG_LEVEL.has('warn')) { return }
  loggerService.warn(message, context)
}

export const log = (message: string, context?: string) => {
  if (!LOG_LEVEL.has('log')) { return }
  loggerService.log(message, context)
}

export const logDebug = (message: string, context?: string) => {
  if (!LOG_LEVEL.has('debug')) { return }
  loggerService.debug(message, context)
}
