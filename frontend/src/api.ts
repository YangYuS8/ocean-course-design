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

// VITE_API_BASE_URL 可以在 .env.local 中配置；没有配置时默认连接本机 Laravel 后端。
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000/api'

// localStorage 的 key，用于保存登录后端返回的 token。
const TOKEN_KEY = 'ocean-admin-token'

// 表单提交给后端的数据可能是对象、数组、字符串、数字、布尔值或 null。
type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null

/** 读取本地保存的登录 token。 */
export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

/** 保存登录 token，页面刷新后仍可恢复会话。 */
export function storeToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

/** 清除登录 token，退出登录或 token 失效时使用。 */
export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

/**
 * 统一请求函数。
 *
 * 所有 api 方法最终都会调用 request()：
 * - 自动拼接 API_BASE_URL；
 * - 自动设置 JSON 请求头；
 * - 如果本地有 token，自动加入 Authorization；
 * - 统一处理错误响应；
 * - 将 JSON 响应转换为 TypeScript 泛型 T。
 */
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

/**
 * 有些接口可能直接返回数组，也可能返回 { data: [...] } 或 { items: [...] }。
 * 这个函数把它们统一转成数组，页面就不用关心后端包装格式。
 */
function unwrapList<T>(payload: T[] | { data?: T[] } | { items?: T[] }): T[] {
  if (Array.isArray(payload)) return payload
  if ('data' in payload && Array.isArray(payload.data)) return payload.data
  if ('items' in payload && Array.isArray(payload.items)) return payload.items
  return []
}

/**
 * 前端调用后端的统一 API 对象。
 * 页面中不要直接写 fetch，统一调用这里的方法，便于维护接口地址、token 和错误处理。
 */
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
  resolveException: (id: number, resolution: string) =>
    request<ExceptionRecord>(`/exceptions/${id}/resolve`, { method: 'POST', body: JSON.stringify({ resolution }) }),
  analyzeSample: (sampleId: number) => request<AnalysisJob>(`/samples/${sampleId}/analyze`, { method: 'POST' }),
}
