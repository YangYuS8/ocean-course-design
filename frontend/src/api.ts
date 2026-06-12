import type {
  AnalysisJob,
  AuthResponse,
  DashboardData,
  ExceptionRecord,
  InspectionTask,
  Sample,
  SampleResult,
  User,
} from './types'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000/api'

const TOKEN_KEY = 'ocean-admin-token'

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.json().then((data) => data.message).catch(() => `接口请求失败：${response.status}`)
    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

function unwrapList<T>(payload: T[] | { data?: T[] } | { items?: T[] }): T[] {
  if (Array.isArray(payload)) return payload
  if ('data' in payload && Array.isArray(payload.data)) return payload.data
  if ('items' in payload && Array.isArray(payload.items)) return payload.items
  return []
}

export const api = {
  login: (data: JsonValue) => request<AuthResponse>('/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<User>('/me'),
  logout: () => request<void>('/logout', { method: 'POST' }),
  getUsers: async () => unwrapList(await request<User[] | { data?: User[] }>('/users')),
  createUser: (data: JsonValue) => request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: number, data: JsonValue) => request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: number) => request<void>(`/users/${id}`, { method: 'DELETE' }),
  getDashboard: () => request<DashboardData>('/dashboard'),
  getTasks: async () => unwrapList(await request<InspectionTask[] | { data?: InspectionTask[] }>('/tasks')),
  createTask: (data: JsonValue) => request<InspectionTask>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  startTask: (id: number) => request<InspectionTask>(`/tasks/${id}/start`, { method: 'POST' }),
  submitTask: (id: number) => request<InspectionTask>(`/tasks/${id}/submit`, { method: 'POST' }),
  getSamples: async () => unwrapList(await request<Sample[] | { data?: Sample[] }>('/samples')),
  createSample: (data: JsonValue) => request<Sample>('/samples', { method: 'POST', body: JSON.stringify(data) }),
  getResults: async () => unwrapList(await request<SampleResult[] | { data?: SampleResult[] }>('/results')),
  addResult: (sampleId: number, data: JsonValue) =>
    request<SampleResult>(`/samples/${sampleId}/results`, { method: 'POST', body: JSON.stringify(data) }),
  getExceptions: async () => unwrapList(await request<ExceptionRecord[] | { data?: ExceptionRecord[] }>('/exceptions')),
  createException: (data: JsonValue) =>
    request<ExceptionRecord>('/exceptions', { method: 'POST', body: JSON.stringify(data) }),
  resolveException: (id: number) => request<ExceptionRecord>(`/exceptions/${id}/resolve`, { method: 'POST' }),
  analyzeSample: (sampleId: number) => request<AnalysisJob>(`/samples/${sampleId}/analyze`, { method: 'POST' }),
}
