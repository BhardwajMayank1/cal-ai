import api from './api'

export async function getSummary() {
    const response = await api.get('/dashboard/summary')
    return response.data
}