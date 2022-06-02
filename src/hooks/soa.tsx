/**
 * @file SOA
 * @author Yolo
 * @description SOA = useContext + useMemo
 * @description 松散耦合 = 细粒度分化 + UI 组合 + Logic 聚合
 * @description useXxxService 返回的对象必须使用 useMemo 缓存，否则组件每次重新运行都会生成一个新对象，导致旗下子组件进行不必要的脏检查
 */

import { createContext, ProviderProps, useContext, useMemo } from 'react'

interface ServiceProviderProps<P, R> extends Partial<ProviderProps<R>> {
  /**
   * @description 服务的参数
   */
  deps?: P
}

/**
 * @author Yolo
 * @description 创建一个服务，内聚服务令牌
 * @param {*} service 服务
 * @returns
 */
export function createService<P extends any[], R>(service: (...args: P) => R) {
  // 创建服务 Token
  const ServiceContext = createContext(service.name as unknown as R)

  // 设置 component name - 用于 devtools 调试
  ServiceContext.displayName = service.name || 'UnknownService'

  const Provider = (props: ServiceProviderProps<P, R>) => {
    /**
     * 可由外部决定 [实例] 在何处初始化
     *
     * 1. 在外部初始化，即组合
     * 2. 在此处初始化，即聚合
     */
    const { deps, value, children } = props

    // 若外部未传值，则自动初始化并将参数传递
    const provideValue = value ?? service(...(deps ? deps : ([] as unknown as P)))

    return useMemo(() => {
      return <ServiceContext.Provider value={provideValue}>{children}</ServiceContext.Provider>
    }, [provideValue, children])
  }

  const useInject = () => {
    const instance = useContext(ServiceContext)

    if (instance === null) throw new Error('Cannot inject before provided .')

    return instance
  }

  return {
    Provider,
    useInject,
  }
}
