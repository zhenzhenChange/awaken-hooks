import { useMemo, useState } from 'react'

import { useCb } from './useCb'

/**
 * @see https://ahooks.js.org/zh-CN/hooks/use-selections
 * @description 主要解决数据在动态变化的情况下，新的勾选操作会导致上一次已勾选的数据被清空的问题
 */
export function useSelection<T>() {
  const [selected, setSelected] = useState<T[]>([])
  const selectedSet = useMemo(() => new Set(selected), [selected])

  // 检查是否含有指定项
  const hasSelected = useCb((item: T) => selectedSet.has(item))

  // 更新并将新值返回
  const update = useCb(() => {
    const newSelected = [...selectedSet]
    setSelected(newSelected)

    return newSelected
  })

  // 清空
  const clear = useCb(() => {
    selectedSet.clear()
    return update()
  })

  // 添加一项
  const append = useCb((item: T) => {
    selectedSet.add(item)
    return update()
  })

  // 移除一项
  const remove = useCb((item: T) => {
    selectedSet.delete(item)
    return update()
  })

  // 添加多项
  const appendMultiple = useCb((items: T[]) => {
    items.forEach((item) => selectedSet.add(item))
    return update()
  })

  // 移除多项
  const removeMultiple = useCb((items: T[]) => {
    items.forEach((item) => selectedSet.delete(item))
    return update()
  })

  return useMemo(() => {
    return {
      selected,
      setSelected,
      hasSelected,

      clear,
      append,
      remove,
      appendMultiple,
      removeMultiple,
    }
  }, [selected, hasSelected, clear, append, remove, appendMultiple, removeMultiple])
}
