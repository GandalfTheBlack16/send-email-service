import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  level: 'info',
  format: format.colorize(),
  transports: [
    new transports.Console({
      format: format.simple()
    })
  ]
})
