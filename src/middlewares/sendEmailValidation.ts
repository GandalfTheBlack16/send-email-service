import { type NextFunction, type Request, type Response } from 'express'
import { type SendEmailRequestBody } from '../types'

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const payload: SendEmailRequestBody | undefined = req.body
  if (!payload) {
    return setResponse(res, 'Request body is missing')
  }
  const { recipients, content, subject } = payload
  if (!recipients) {
    return setResponse(res, 'Request body\'s \'recipients\' property is missing')
  }
  if (!content) {
    return setResponse(res, 'Request body\'s \'content\' property is missing')
  }
  if (!subject) {
    return setResponse(res, 'Request body\'s \'subject\' property is missing')
  }
  if (!(recipients instanceof Array)) {
    return setResponse(res, 'Request body\'s \'recipients\' property should be an Array of strings')
  }

  for (const emaiAddress of recipients) {
    if (!validateEmailAddress(emaiAddress)) {
      return setResponse(res, `Email address ${emaiAddress} is not valid`)
    }
  }

  if (isHtmlContent(content)) {
    req.body.html = content
  } else {
    req.body.text = content
  }

  delete req.body.content
  next()
}

const validateEmailAddress = (address: string) => {
  return address
    .toLowerCase()
    .trim()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const setResponse = (res: Response, message: string) => {
  return res.status(400).json({
    status: 'Validation error',
    message
  })
}

const isHtmlContent = (contet: string) => {
  const regex = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/
  return regex.test(contet)
}
