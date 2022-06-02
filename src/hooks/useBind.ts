import { useEffect, useRef } from 'react'

/**
 * @description 将一个值转存（绑定）给不变对象（useRef），使得（ref）在组件的一个生命周期内保持不变且内部的值（current）为最新
 * @param value 值（可以是任意类型，Dom 除外，因为 Dom 是由框架内部自动处理的类似以下操作）
 * @returns
 */
export function useBind<T>(value: T) {
  const valueRef = useRef(value)

  // 在组件挂载完毕执行更新操作
  useEffect(() => {
    valueRef.current = value
  })

  return valueRef
}
