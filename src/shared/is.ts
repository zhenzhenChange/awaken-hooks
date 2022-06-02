/**
 * @description 是否为函数类型
 * @param val 要判断的值
 * @returns
 */
 export const isFunction = (val: unknown): val is Function => typeof val === 'function'
