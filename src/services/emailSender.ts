import { AuthenticationException } from '../exceptions/gmailApiExceptions'
import { oAuth2Client } from '../security/oauthClient'
import { createTransport, type SendMailOptions } from 'nodemailer'
import { type EmailSenderProps } from '../types'

export async function sendEmail ({
  recipients,
  subject,
  text,
  html
}: EmailSenderProps) {
  const { token: accessToken } = await oAuth2Client.getAccessToken()
  if (accessToken == null) {
    throw new AuthenticationException('Could not get an accessToken using oAuth client')
  }
  const transport = createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_ACCOUNT_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken
    }
  })

  const mailoptions: SendMailOptions = {
    from: `Admin Password-manager <${process.env.GOOGLE_ACCOUNT_EMAIL}>`,
    to: recipients,
    subject,
    text: html != null ? '' : text,
    html
  }

  const { accepted, rejected } = await transport.sendMail(mailoptions)
  return {
    accepted, rejected
  }
}
