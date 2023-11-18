import { config } from 'dotenv'
import { sendEmail as emailSender } from './services/emailSender'
import express, { json, type Request, type Response } from 'express'
import { logger } from './log/logger'
import { validateRequest } from './middlewares/sendEmailValidation'
import { type EmailSenderProps } from './types'

config()

const app = express()

app.use(json())

app.post('/email', validateRequest, async (req: Request, res: Response) => {
  try {
    const data: EmailSenderProps = req.body
    const { accepted, rejected } = await emailSender(data)
    if (accepted.length === 0) {
      return res.status(404).json({
        status: 'Invalid recipients',
        message: 'Cannot send email to none of email adresses',
        adresses: rejected
      })
    }
    if (rejected.length !== 0) {
      return res.status(206).json({
        status: 'Partial content',
        message: 'Email sent to some recipients',
        accepted,
        rejected
      })
    }
    res.json({
      status: 'Success',
      message: 'Email sent to all recipients',
      addresses: accepted
    })
  } catch (error) {
    logger.error(`Error sending email: ${(error as Error).stack}`)
    res.status(500).json({
      status: 'Internal server error',
      message: 'Unexpected error occurred. Try again later'
    })
  }
})

app.listen(process.env.PORT, () => {
  logger.info(`Express application listening on port ${process.env.PORT}`)
})
