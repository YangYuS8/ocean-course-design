import { useCallback, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, api } from '../api'
import { mockDashboard, mockExceptions, mockResults, mockSamples, mockTasks } from '../mockData'
import type { DashboardData, ExceptionRecord, InspectionTask, Sample, SampleResult } from '../types'
import { getDashboardStats } from '../utils/dashboard'

export function useOceanData() {
  const [tasks, setTasks] = useState<InspectionTask[]>(mockTasks)
  const [samples, setSamples] = useState<Sample[]>(mockSamples)
  const [results, setResults] = useState<SampleResult[]>(mockResults)
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>(mockExceptions)
  const [dashboard, setDashboard] = useState<DashboardData>(mockDashboard)
  const [notice, setNotice] = useState('正在尝试连接后端接口')
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  const refreshAll = useCallback(async () => {
    setLoading(true)
    try {
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
    } catch {
      setConnected(false)
      setNotice('演示数据模式')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshAll()
  }, [refreshAll])

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
