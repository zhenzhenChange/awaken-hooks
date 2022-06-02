/**
 * @description object params to query string
 * @param params params
 * @returns
 */
export const toQuery = (params: Record<string, any>) => {
  return Object.keys(params)
    .filter((key) => !['', null, undefined].includes(params[key])) // 过滤：''/null/undefined
    .map((key) => {
      let value = params[key]

      return `${key}=${encodeURIComponent(value)}`
    })
    .join('&')
}
