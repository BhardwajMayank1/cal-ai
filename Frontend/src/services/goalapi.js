import api from './api'

export async function setGoals({ calories, protein, carbs, fat }) {
    const response = await api.post('/goals/setGoals', { calories, protein, carbs, fat })
    return response.data
}

export async function getGoals() {
    const response = await api.get('/goals/getGoals')
    return response.data
}

export async function updateGoals({ calories, protein, carbs, fat }) {
    const response = await api.put('/goals/updateGoals', { calories, protein, carbs, fat })
    return response.data
}