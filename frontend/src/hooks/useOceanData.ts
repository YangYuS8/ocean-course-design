import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, api } from '../api'
import type { DashboardData, ExceptionRecord, InspectionTask, Sample, SampleResult } from '../types'
import { getDashboardStats } from '../utils/dashboard'

// 空 dashboard 用于页面第一次加载时的安全默认值。
// 注意：这里不是假业务数据，真实列表数据仍然来自后端 API。
const emptyDashboard: DashboardData = {
  business_chain: ['巡检任务', '样本登记', '检测结果', '异常处理', '分析建议', '首页统计'],
  statistics: {
    tasks_total: 0,
    tasks_in_progress: 0,
    samples_total: 0,
    results_total: 0,
    open_exceptions: 0,
    analysis_total: 0,
  },
  recent_tasks: [],
  abnormal_results: [],
  recent_exceptions: [],
  recent_analyses: [],
}

/**
 * useOceanData 是业务数据加载 Hook。
 *
 * Hook 是 React 中复用状态逻辑的方式。这里把 dashboard、tasks、samples、results、exceptions
 * 的请求集中在一起，避免每个页面重复写请求代码。
 */
export function useOceanData(enabled = true) {
  const [tasks, setTasks] = useState<InspectionTask[]>([])
  const [samples, setSamples] = useState<Sample[]>([])
  const [results, setResults] = useState<SampleResult[]>([])
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>([])
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard)
  const [notice, setNotice] = useState('正在连接后端服务')
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  /** 同时刷新所有业务数据。 */
  const refreshAll = useCallback(async () => {
    setLoading(true)
    try {
      // Promise.all 可以并行请求多个接口，比一个一个等待更快。
      const [dashboardData, taskData, sampleData, resultData, exceptionData] = await Promise.all([
        api.getDashboard(),
        api.getTasks(),
        api.getSamples(),
        api.getResults(),
        api.getExceptions(),
      ])
      setDashboard(dashboardData)
      setTasks(taskData)
      setSamples(sampleData)
      setResults(resultData)
      setExceptions(exceptionData)
      setConnected(true)
      setNotice('后端已连接')
    } catch (error) {
      setConnected(false)
      setNotice(error instanceof Error ? error.message : '后端连接失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    void refreshAll()
  }, [enabled, refreshAll])

  // useMemo 用来缓存统计结果，只有依赖数据变化时才重新计算。
  const stats = useMemo(
    () => getDashboardStats(dashboard, tasks, samples, results, exceptions),
    [dashboard, exceptions, results, samples, tasks],
  )

  return {
    apiBaseUrl: API_BASE_URL,
    connected,
    dashboard,
    exceptions,
    loading,
    notice,
    refreshAll,
    results,
    samples,
    stats,
    tasks,
  }
}
