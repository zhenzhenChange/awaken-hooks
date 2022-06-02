import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useId, useMemo } from 'react'

import { useBind } from './useBind'

/**
 * @description EDA - 事件驱动
 * @param eventName 事件名称
 * @returns
 */
export function createEventScope<T = any>(eventName = '') {
  // 创建一个上下文
  const EventScopeContext = createContext<string>(undefined as unknown as string)
  EventScopeContext.displayName = `EventScope${eventName}`

  /**
   * @description 行成事件作用域范围
   */
  const EventScope = (props: PropsWithChildren<{ id?: string }>) => {
    const { id = useId(), children } = props

    return useMemo(() => {
      return <EventScopeContext.Provider value={id}>{children}</EventScopeContext.Provider>
    }, [children, id])
  }

  /**
   * @description 派发自定义事件
   */
  const useDispatch = () => {
    const id = useContext(EventScopeContext)

    return useCallback((val?: T) => document.dispatchEvent(new CustomEvent(id, { detail: val })), [id])
  }

  /**
   * @description 监听自定义事件
   * @param cb 事件触发后的回调
   */
  const useListener = (cb: (val?: T) => void) => {
    const id = useContext(EventScopeContext)

    const cbRef = useBind(cb)

    useEffect(() => {
      const handler = (e: CustomEventInit) => cbRef.current(e.detail)

      document.addEventListener(id, handler)

      return () => {
        document.removeEventListener(id, handler)
      }
    }, [cbRef, id])
  }

  return {
    EventScope,
    useListener,
    useDispatch,
  }
}
