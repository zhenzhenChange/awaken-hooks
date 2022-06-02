import { useCallback } from 'react'

import { useBind } from './useBind'

/**
 * @see https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 * @description 抹平 useCallback 的依赖
 * @param cb 回调函数
 * @returns
 */
export function useCb<P extends any[], R>(cb: (...args: P) => R) {
  const cbRef = useBind(cb)

  return useCallback((...args: P) => cbRef.current(...args), [cbRef])
}
