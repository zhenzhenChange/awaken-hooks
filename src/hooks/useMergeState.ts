import { useState, useCallback } from 'react'

import { useBind } from './useBind'
import { isFunction } from '../shared'

/**
 * @description 用于对象合并
 * @param initialState 可以传递一个类 - 类既可以当值 new 又可以当类型传递
 * @returns
 */
export function useMergeState<T>(initialState: T | (new () => T)) {
  const [state, setState] = useState(() => (isFunction(initialState) ? new initialState() : initialState))

  const stateRef = useBind(state)
  const mergeState = useCallback((nextState: Partial<T>) => setState({ ...stateRef.current, ...nextState }), [stateRef])

  return [state, stateRef, mergeState] as const
}
