import { message } from 'antd'

import { toQuery } from './string'

interface FetcherOptions {
  method?: 'get' | 'post'
  payload?: Record<string, any>
}

interface FetcherResponse {
  code: number
  content: any
  succeeded: boolean
  errorMessage?: string
}

export function fetcher(api: RequestInfo, options?: FetcherOptions) {
  const { method = 'get', payload = {} } = options ?? {}

  let finallyApi = api
  let postConfig: RequestInit | undefined

  switch (method) {
    case 'get': {
      const queryString = toQuery(payload)
      const hasQueryString = Boolean(queryString.trim().length)

      finallyApi += hasQueryString ? `?${queryString}` : ''
      break
    }

    case 'post':
      postConfig = { body: JSON.stringify(payload), method: 'post', headers: { 'content-type': 'application/json;utf-8' } }
      break

    default:
      break
  }

  return fetch(finallyApi, postConfig)
    .then((response) => {
      const { ok, status, statusText } = response

      switch (ok) {
        case true:
          return response.json()

        case false:
        default:
          return Promise.reject({
            code: status,
            content: `${status} ${statusText}`,
            succeeded: false,
            errorMessage: 'Server Error',
          })
      }
    })
    .then((response): Promise<FetcherResponse> => {
      const { status, error, errors, content, statusCode } = response

      if (status === 404) {
        return Promise.reject({
          code: status,
          content: `${status} ${error}`,
          succeeded: false,
          errorMessage: 'Server Error',
        })
      }

      if (status === 400) {
        return Promise.reject({
          code: status,
          content: errors,
          succeeded: false,
          errorMessage: 'Client Error',
        })
      }

      if (statusCode !== 200) {
        return Promise.reject({
          code: statusCode,
          content,
          succeeded: false,
          errorMessage: 'Server Error',
        })
      }

      return Promise.resolve({ code: statusCode, content, succeeded: true })
    })
    .catch((reason: FetcherResponse): Promise<FetcherResponse> => {
      const { code, content } = reason

      switch (code) {
        // 接口请求入参错误
        case 400: {
          content.forEach((item: any) => message.error(item.defaultMessage))
          break
        }

        case 11000: // 登录态异常
          message.error(content)
          break

        // 未配置的错误
        default:
          message.error(content)
          break
      }

      return Promise.reject(reason)
    })
}
