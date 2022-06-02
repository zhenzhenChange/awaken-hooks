import { fetcher } from '../shared'
import { useEffect, useMemo, useState } from 'react'
import { useBind, useCb, useMergeState } from './'

interface RecordOptions<P> {
  api: string
  payload: P | (new () => P)
}

export function useRecord<T, P>(options: RecordOptions<P>) {
  const optionsRef = useBind(options)

  const [recordList, setRecordList] = useState<T[]>([])
  const [recordTotal, setRecordTotal] = useState(0)
  const [recordLoading, setRecordLoading] = useState(false)
  const [recordSelectedList, setRecordSelectedList] = useState<T[]>([])

  const [recordPayload, recordPayloadRef, setRecordPayload] = useMergeState(optionsRef.current.payload)

  const recordRequest = useCb(async () => {
    try {
      setRecordLoading(true)

      const { content } = await fetcher(optionsRef.current.api, { payload: recordPayloadRef.current })

      setRecordList(content?.content ?? [])
      setRecordTotal(content?.totalRecord ?? 0)
    } catch (error) {
      console.error(error)
    } finally {
      setRecordLoading(false)
    }
  })

  useEffect(() => {
    recordRequest()
  }, [recordPayload, recordRequest])

  return useMemo(() => {
    return {
      recordList,
      recordTotal,
      recordLoading,
      recordPayload,
      recordSelectedList,

      recordRequest,
      setRecordPayload,
      setRecordSelectedList,
    }
  }, [recordList, recordLoading, recordPayload, recordRequest, recordSelectedList, recordTotal, setRecordPayload])
}
