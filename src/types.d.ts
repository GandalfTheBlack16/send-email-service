type Recipients = string[]
type Subject = string

export interface SendEmailRequestBody {
  recipients: Recipients
  subject: Subject
  content: string
}

export interface EmailSenderProps {
  recipients: Recipients
  subject: Subject
  text?: string
  html?: string
}
