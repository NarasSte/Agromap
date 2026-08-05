import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
})

export async function fetchResource(resource: string) {
  const response = await api.get(`/${resource}`)
  return response.data as unknown
}

export async function createResource(resource: string, data: unknown) {
  const response = await api.post(`/${resource}`, data)
  return response.data as unknown
}
